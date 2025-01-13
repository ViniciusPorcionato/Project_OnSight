using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using OnSight.Application.RealTime.Contracts.Requests;
using OnSight.Application.RealTime.Interfaces;
using OnSight.Application.Services.CallAssignmentManagerService;
using OnSight.Application.Services.Contracts.Requests;
using OnSight.Application.Services.ServiceCallService.Contracts.Responses;
using OnSight.Domain.Entities;
using OnSight.Domain.Respositories;
using OnSight.Infra.Data.DAOs.IndividualPersonDAO;
using OnSight.Infra.Data.DAOs.ServiceCallDAO;
using OnSight.Infra.Data.DAOs.ServiceCallDAO.DTOs;
using OnSight.Infra.Data.UnityOfWork;
using OnSight.Infra.Geolocation;

namespace OnSight.Application.Services.ServiceCallService;

public class ServiceCallService : IServiceCallService
{
    private readonly IIndividualPersonDAO _individualPersonDAO;
    private readonly IServiceCallDAO _serviceCallDAO;

    private readonly IServiceCallRepository _serviceCallRepository;
    private readonly IUserRepository _userRepository;

    private readonly ICallAssignmentManagerService _callAssignmentManagerService;

    private readonly IUnityOfWork _unityOfWork;

    private readonly ICepInterpreterProvider _cepInterpreterProvider;
    private readonly IGeolocationProvider _geolocationProvider;

    private readonly IActiveUserService _activeUserService;

    public ServiceCallService(IIndividualPersonDAO individualPersonDAO, IServiceCallDAO serviceCallDAO, IServiceCallRepository serviceCallRepository, IUserRepository userRepository, ICallAssignmentManagerService callAssignmentManagerService, IUnityOfWork unityOfWork, ICepInterpreterProvider cepInterpreterProvider, IGeolocationProvider geolocationProvider, IActiveUserService activeUserService)
    {
        _individualPersonDAO = individualPersonDAO;
        _serviceCallDAO = serviceCallDAO;

        _serviceCallRepository = serviceCallRepository;
        _userRepository = userRepository;

        _callAssignmentManagerService = callAssignmentManagerService;

        _unityOfWork = unityOfWork;

        _cepInterpreterProvider = cepInterpreterProvider;
        _geolocationProvider = geolocationProvider;

        _activeUserService = activeUserService;
    }

    public async Task<TechnicianSelectedForDTO> AttendantRevisionUpdate(AttendantRevisionUpdateRequest request)
    {
        try
        {
            var serviceCall = await _serviceCallRepository.GetServiceCallById(request.serviceCallId);

            if (serviceCall == null)
                throw new Exception("Service call has not been finded");

            serviceCall.AttendantUpdate(
                responsibleAttendentId: request.responsibleAttendentId,
                deadline: request.deadline,
                description: request.serviceCallDescription!.Trim(),
                serviceType: request.serviceType,
                urgencyStatus: request.urgencyStatus,
                instantSolutionDescription: request.instantSolutionDescription!.Trim(),
                isCallApproved: request.isCallApproved
            );

            var technicianSelectedResponse = await assignTechnicianToCall(serviceCall);

            await _unityOfWork.Commit();

            return technicianSelectedResponse!;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task ReassignTechnicianToCall(Guid serviceCallId)
    {
        try
        {
            var serviceCall = await _serviceCallRepository.GetServiceCallById(serviceCallId);

            await assignTechnicianToCall(serviceCall);

            await _unityOfWork.Commit();
        }
        catch(Exception)
        {
            throw;
        }
    }

    private async Task<TechnicianSelectedForDTO> assignTechnicianToCall(ServiceCall serviceCall)
    {
        try
        {
            TechnicianSelectedForDTO technicianSelectedResponse = null!;

            if (serviceCall.CallStatus == CallStatuses.InProgress)
            {
                var connectedTechniciansEnumerable = (_activeUserService.GetActiveGroupConnections(GroupsName.Technicians)!);

                if (connectedTechniciansEnumerable == null)
                    throw new Exception("There is no connected technicians.");

                var connectedTechnicians = connectedTechniciansEnumerable.ToList();

                List<TechnicianRealTimeDTO> avaliableTechnicians = new List<TechnicianRealTimeDTO>();

                for (int connectedTechnicianIndex = 0; connectedTechnicianIndex < connectedTechnicians.Count(); connectedTechnicianIndex++)
                {
                    var connectedTechnician = connectedTechnicians[connectedTechnicianIndex].technicianRealTimeDTO;

                    if (connectedTechnician!.latitude == 0 && connectedTechnician.longitude == 0)
                        continue;

                    var technicianId = connectedTechnician!.technician.Id;
                    var technicianUpdatedData = await _userRepository.GetTechnicianById(technicianId);

                    if (technicianUpdatedData.Status != TechnicianStatus.Available)
                        continue;

                    avaliableTechnicians.Add(new TechnicianRealTimeDTO(
                        technician: technicianUpdatedData,
                        latitude: connectedTechnician.latitude,
                        longitude: connectedTechnician.longitude
                    ));
                }

                technicianSelectedResponse = await _callAssignmentManagerService.AttributeServiceCallForTechnician(serviceCall, avaliableTechnicians.ToArray());
            }

            if (technicianSelectedResponse != null)
            {
                var selectedTechnician = await _userRepository.GetTechnicianById(technicianSelectedResponse.technicianId);

                selectedTechnician.TurnStatusToWorking();
            }

            return technicianSelectedResponse!;
        }
        catch(Exception)
        {
            throw;
        }
    }

    public async Task FinishServiceCall(Guid serviceCallId)
    {
        try
        {
            var serviceCall = await _serviceCallRepository.GetServiceCallById(serviceCallId);

            if (serviceCall == null)
                throw new Exception("Service call has not been finded");

            serviceCall.FinishServiceCall();

            var selectedTechnician = await _userRepository.GetTechnicianById(serviceCall.TechnicianId);

            if (selectedTechnician == null)
                throw new Exception("There is no technician assigned to this service call");

            selectedTechnician.MakeAvaliable();

            await _unityOfWork.Commit();
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task RegisterServiceCall(RegisterServiceCallRequest request)
    {
        try
        {
            var addressResponse = await _cepInterpreterProvider.GetAddressFromCep(request.addressCEP);

            string formattedAddressText = $"{addressResponse.logradouro}, {request.addressNumber}. {addressResponse.localidade}";

            var locationResponse = await _geolocationProvider.GetGeocodingLocationByAddress(formattedAddressText);

            var address = new Address(
                cep: request.addressCEP,
                number: request.addressNumber,
                complement: request.addressComplement,
                latitude: (decimal)locationResponse.latitude,
                longitude: (decimal)locationResponse.longitude
            );

            await _serviceCallRepository.RegisterAddress(address);

            var serviceCall = new ServiceCall(
                clientId: request.clientId,
                serviceType: request.serviceType,
                addressId: address.Id,
                contactEmail: request.contactEmail,
                contactPhoneNumber: request.contactPhoneNumber,
                description: request.callReasonDescription,
                isRecurringCall: request.isRecurringCall
            );

            await _serviceCallRepository.RegisterServiceCall(serviceCall);

            await _unityOfWork.Commit();
        }
        catch (Exception)
        {
            throw;
        }
    }
    public async Task<IEnumerable<ServiceCallHistoryResponse>> GetCallHistoricByTechnicianId(Guid technicianId)
    {
        try
        {
            List<CallHistoryDTO> callHistory = (List<CallHistoryDTO>)await _serviceCallDAO.GetTechnicianCallHistory(technicianId);

            if (callHistory == null)
                throw new Exception("Nenhum chamado encontrado ao técnico especificado.");

            IEnumerable<ServiceCallHistoryResponse> responseCallHistory = callHistory.Select(call => new ServiceCallHistoryResponse
            (
                call.idServiceCall,
                call.callStatusId,
                call.creationDateTime,
                call.callDescription,
                call.callServiceTypeId,
                call.callUrgencyStatusId,
                //call.clientId,
                call.tradeName,
                call.profileImageUrl
            ));

            return responseCallHistory;
        }
        catch (Exception)
        {
            throw;
        }
    }
    public async Task<IEnumerable<OpenedServiceCallResponse>> GetOpenedServiceCallsList()
    {
        try
        {
            List<OpenedServiceCallDTO> openedServiceCalls = (List<OpenedServiceCallDTO>)await _serviceCallDAO.GetOpenedServiceCalls();

            //if (openedServiceCalls.Count == 0)
            //    throw new Exception("Nenhum chamado em aberto foi encontrado.");

            IEnumerable<OpenedServiceCallResponse> openedCallsResponse = openedServiceCalls.Select(call => new OpenedServiceCallResponse
            (
                call.idServiceCall,
                call.tradeName,
                call.serviceCallTypeId,
                call.serviceCallCreationDateTime
            ));

            return openedCallsResponse;
        }
        catch (Exception)
        {
            throw;
        }
    }
    public async Task<DetailsServiceCallResponse> GetServiceCallDetailsById(Guid idServiceCall)
    {
        try
        {
            ServiceCallDetailsDTO detailsOpenedCall = await _serviceCallDAO.GetServiceCallDetailsById(idServiceCall);

            if (detailsOpenedCall == null)
                throw new Exception("Chamado não encontrado, verifique o id enviado.");

            var fullAddress = await  _cepInterpreterProvider.GetAddressFromCep(detailsOpenedCall.addressCep);

            DetailsServiceCallResponse detailsServiceCallResponse = new
             (
                    detailsOpenedCall.serviceCallId,
                    detailsOpenedCall.callCode,
                    detailsOpenedCall.callStatusId,
                    detailsOpenedCall.creationDateTime,
                    detailsOpenedCall.serviceTypeId,
                    detailsOpenedCall.phoneNumberClient,
                    detailsOpenedCall.emailClient,
                    detailsOpenedCall.addressCep,
                    addressStreet: fullAddress.logradouro,
                    addressNeightborhood: fullAddress.bairro,
                    addressCity: fullAddress.localidade,
                    detailsOpenedCall.addressNumber,
                    detailsOpenedCall.addressComplement,
                    detailsOpenedCall.isRecurring,
                    detailsOpenedCall.conclusionDateTime,
                    detailsOpenedCall.urgencyStatusId,
                    detailsOpenedCall.description,
                    detailsOpenedCall.clientTradeName,
                    detailsOpenedCall.clientPhotoImgUrl,
                    detailsOpenedCall.responsibleAttendantName,
                    detailsOpenedCall.deadLine
            );

            return detailsServiceCallResponse;
        }
        catch (Exception)
        {
            throw;
        }
    }
    public async Task<DetailsServiceCallResponse> GetCurrentTechnicianCallById(Guid technicianId)
    {
        try
        {
            // verificar se...
            // - o técnico está online
            // - a chamada está pendente
            // - buscar
            CurrentServiceCallDTO currentService = await _individualPersonDAO.GetServiceCallIdByTechnicianId(technicianId);


            if (currentService == null) throw new Exception("Técnico não encontrado, verifique o id enviado.");


            // Verifica se o STATUS do TÉCNICO está Offline ou Unavailable
            if (currentService.technicianStatus == (int)TechnicianStatus.Offline && currentService.technicianStatus == (int)TechnicianStatus.Unavaliable)
                throw new Exception("O técnico está indisponível no momento.");

            // Se o STATUS do TÉCNICO estiver como em serviço (Working)
            ServiceCallDetailsDTO detailsOpenedCall = await _serviceCallDAO.GetServiceCallDetailsById(currentService.serviceCallId);

            // Verifica se o Chamado foi encontrado
            if (detailsOpenedCall == null) throw new Exception("Chamado não encontrado, verifique o id enviado.");

            var fullAddress = await _cepInterpreterProvider.GetAddressFromCep(detailsOpenedCall.addressCep);

            // Verifica se o chamado está em progresso
            if (detailsOpenedCall.callStatusId == (int)CallStatuses.InProgress)
            {
                 DetailsServiceCallResponse detailsServiceCallResponse = new
                 (
                        detailsOpenedCall.serviceCallId,
                        detailsOpenedCall.callCode,
                        detailsOpenedCall.callStatusId,
                        detailsOpenedCall.creationDateTime,
                        detailsOpenedCall.serviceTypeId,
                        detailsOpenedCall.phoneNumberClient,
                        detailsOpenedCall.emailClient,
                        detailsOpenedCall.addressCep,
                        addressStreet: fullAddress.logradouro,
                        addressNeightborhood: fullAddress.bairro,
                        addressCity: fullAddress.localidade,
                        detailsOpenedCall.addressNumber,
                        detailsOpenedCall.addressComplement,
                        detailsOpenedCall.isRecurring,
                        detailsOpenedCall.conclusionDateTime,
                        detailsOpenedCall.urgencyStatusId,
                        detailsOpenedCall.description,
                        detailsOpenedCall.clientTradeName,
                        detailsOpenedCall.clientPhotoImgUrl,
                        detailsOpenedCall.responsibleAttendantName,
                        detailsOpenedCall.deadLine
                );

                return detailsServiceCallResponse;
            }

            throw new Exception("O Chamado encontrado não está em andamento.");
        }
        catch (Exception)
        {
            throw;
        }
    }
    public async Task<IEnumerable<OpenedServiceCallDTO>> GetFilteredOpenedCallsSearchAndFilter(string? textToSearch = null, int serviceTypeId = 2)
    {
        try
        {
            List<OpenedServiceCallDTO> serviceCallsList = [];

            // Se não houver pesquisa, retornar todos os Chamados
            if (textToSearch == null && serviceTypeId == 2)
                serviceCallsList = (List<OpenedServiceCallDTO>)await _serviceCallDAO!.GetOpenedServiceCalls();
            else
            {
                serviceCallsList = (List<OpenedServiceCallDTO>)await _serviceCallDAO!.GetFilteredOpenedCallsListSearchAndFilter(textToSearch!, serviceTypeId);
            }

            return serviceCallsList;
        }
        catch (Exception)
        {
            throw;
        }
    }
    public async Task<IEnumerable<ServiceCallsListResponse>> GetServiceCallsSearchAndFilter(string? textToSearch, int serviceCallId = 0)
    {
        try
        {
            List<ServiceCallsListResponse> serviceCallsListResponses;
            var serviceCallsList = await _serviceCallDAO.GetCallsSearchAndFilter(textToSearch!, serviceCallId);

            serviceCallsListResponses = serviceCallsList.Select(serviceCall => new ServiceCallsListResponse
            (
                serviceCall.serviceCallId,
                serviceCall.clientId,
                serviceCall.clientPhotoUrl,
                serviceCall.clientTradeName,
                serviceCall.callTypeId,
                serviceCall.callStatusId
            )).ToList();

            return serviceCallsListResponses;
        }
        catch (Exception)
        {
            throw;
        }
    }
}
