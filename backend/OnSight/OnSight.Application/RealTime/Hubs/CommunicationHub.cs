using Microsoft.AspNetCore.Authorization;
using OnSight.Application.RealTime.Contracts.Requests;
using OnSight.Application.RealTime.Contracts.Responses;
using OnSight.Application.RealTime.DTOs;
using OnSight.Application.RealTime.Interfaces;
using OnSight.Application.Services;
using OnSight.Application.Services.CallAssignmentManagerService;
using OnSight.Application.Services.ServiceCallService;
using OnSight.Domain.Entities;
using OnSight.Infra.Data.DAOs.ServiceCallDAO;
using OnSight.Domain.Respositories;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace OnSight.Application.RealTime.Hubs;

public class CommunicationHub : UserHub
{
    private readonly IUserService _userService;
    private readonly IServiceCallService _serviceCallService;

    private readonly IActiveUserService _activeUserService;
    private readonly IUserRepository _userRepository;

    private readonly IServiceCallDAO _serviceCallDAO;

    public CommunicationHub(IUserService userService, IServiceCallService serviceCallService, IActiveUserService activeUserService, IServiceCallDAO serviceCallDAO, IUserRepository userRepository) : base(activeUserService)
    {
        _userService = userService;
        _serviceCallService = serviceCallService;

        _activeUserService = activeUserService;

        _serviceCallDAO = serviceCallDAO;
        _userRepository = userRepository;
    }

    public override async Task OnConnectedAsync()
    {
        try
        {
            if (!Context.User!.Identity!.IsAuthenticated)
                throw new Exception("Invalid token");

            var userId = Guid.Parse(Context.User!.FindFirst(JwtRegisteredClaimNames.Jti)!.Value);
            var userName = Context.User.FindFirst(ClaimTypes.Name)!.Value;
            var userType = int.Parse(Context.User.FindFirst(ClaimTypes.Role)!.Value);

            var callerGroupName = GetGroupName(userType);

            TechnicianRealTimeDTO connectedCallerTechnician = null!;

            if (callerGroupName!.Value == GroupsName.Technicians)
            {
                Guid technicianId = Guid.Parse(Context.User.FindFirst("technicia_id")!.Value);

                // Se DIFERENTE de WORKING... altera status
                if (!await IfTechnicianHasEqualStatus(technicianId, TechnicianStatus.Working))
                    connectedCallerTechnician = await ChangeTechnicianStatus(technicianId, (int)TechnicianStatus.Available);

                // SE WORKING... pega do banco de dados o TechnicianRealTimeDTO
                connectedCallerTechnician = new(await _userRepository.GetTechnicianById(technicianId), 0, 0);
            }

            JoinGroupRequest joinGroupRequest = new(userId, callerGroupName.Value, connectedCallerTechnician);
            GroupsName registeredGroup = await JoinGroup(joinGroupRequest);

            // Notifica o técnico
            await NotifyUser(NotificationType.Success, $"Olá, {userName}. Você foi conectado com sucesso em {registeredGroup}.");

            // Atualiza a lista para os InternalUsers
            await GetTechniciansWithRespectiveCalls();
        }
        catch (InvalidOperationException)
        {
            await NotifyUser(NotificationType.Warning, "Você já está conectado.");
        }
        catch (Exception ex)
        {
            await NotifyUser(NotificationType.Error, $"Falha ao conectar-se com o sistema. {ex.Message}");
        }

        await base.OnConnectedAsync();
    }

    // Criado considerando POR ENQUANTO que só há um ConnectionId
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        try
        {
            if (exception == null)
                return;

            var userId = Guid.Parse(Context.User!.FindFirst(JwtRegisteredClaimNames.Jti)!.Value);
            var userType = int.Parse(Context.User!.FindFirst(ClaimTypes.Role)!.Value) == 2 ? GroupsName.Technicians : GroupsName.InternalUsers;

            // Se for um técnico e não estiver em serviço, altera o status dele para OFFLINE
            if (userType == GroupsName.Technicians)
            {
                var technicianId = Guid.Parse(Context.User.FindFirst("technicia_id")!.Value);

                if (!await IfTechnicianHasEqualStatus(technicianId, TechnicianStatus.Working) && !await IfTechnicianHasEqualStatus(technicianId, TechnicianStatus.Unavaliable))
                    await ChangeTechnicianStatus(technicianId, (int)TechnicianStatus.Offline);
            }

            await ExitGroup(new JoinGroupRequest(userId, userType, null));

            await base.OnDisconnectedAsync(exception);
        }
        catch (Exception)
        {
            await NotifyUser(NotificationType.Error, "Erro ao processar a desconexão do usuário.");
            throw;
        }
    }

    [Authorize(Policy = "IsInternalUser")]
    public async Task GetConnectedUsers()
    {
        try
        {
            var groupTechniciansConnections = ListGroupActiveConnections(GroupsName.Technicians);
            var groupInternalUserConnections = ListGroupActiveConnections(GroupsName.InternalUsers);

            var unnion = groupTechniciansConnections.Union(groupInternalUserConnections).ToList();

            await SendConnectedUsers(unnion!);
        }
        catch (Exception)
        {
            await NotifyUser(NotificationType.Error, "Falha ao buscar os técnicos disponíveis no sistema.");
        }
    }


    [Authorize(Policy = "IsInternalUser")]
    public async Task GetAvailableConnectedTechnicians()
    {
        try
        {
            var groupConnections = ListGroupActiveConnections(GroupsName.Technicians);

            var availableTechnicians = groupConnections
                .Where(t => t.technicianRealTimeDTO != null && t.technicianRealTimeDTO.technician.Status == TechnicianStatus.Available)
                .Select(t => t.technicianRealTimeDTO)
                .ToList();

            await SendAvailableTechnicians(availableTechnicians!);
        }
        catch (Exception)
        {
            await NotifyUser(NotificationType.Error, "Falha ao buscar os técnicos disponíveis no sistema.");
        }
    }

    [Authorize(Policy = "IsInternalUser")]
    public async Task GetAllTechnicians()
    {
        try
        {
            var technicians = ListGroupActiveConnections(GroupsName.Technicians);

            var allTechniciansFormatted = technicians
                .Select(t => new SpecificTechnicianDTO(
                    technicianId: t.technicianRealTimeDTO!.technician.Id,
                    technianName: t.technicianRealTimeDTO.technician.IndividualPerson!.Name!,
                    technicianProfileImageUrl: t.technicianRealTimeDTO.technician.IndividualPerson.User!.ProfileImageUrl!,
                    technicianLocation: new LocationDTO(
                        latitude: t.technicianRealTimeDTO.latitude,
                        longitude: t.technicianRealTimeDTO.longitude
                    ),
                    assignedCallLocation: null,
                    respectiveServiceCallId: null
                 ))
                .ToList();

            await SendAllTechnicians(allTechniciansFormatted);
        }
        catch (Exception)
        {
            await NotifyUser(NotificationType.Error, "Falha ao buscar todos os técnicos no sistema.");
        }
    }


    [Authorize(Policy = "IsInternalUser")]
    public async Task GetTechniciansWithRespectiveCalls()
    {
        try
        {
            var technicians = ListGroupActiveConnections(GroupsName.Technicians);
            var serviceCalls = await _serviceCallDAO.GetAllServiceCallsInProgress();

            var techniciansWithRespectiveCalls = technicians
                .Select(t =>
                    {
                        var serviceCall = serviceCalls.FirstOrDefault(call => call.technicianId == t.technicianRealTimeDTO!.technician.Id);

                        return new SpecificTechnicianDTO(
                            technicianId: t.technicianRealTimeDTO!.technician.Id,
                            technianName: t.technicianRealTimeDTO.technician.IndividualPerson!.Name!,
                            technicianProfileImageUrl: t.technicianRealTimeDTO.technician.IndividualPerson.User!.ProfileImageUrl!,
                            technicianLocation: new LocationDTO(
                                latitude: t.technicianRealTimeDTO.latitude,
                                longitude: t.technicianRealTimeDTO.longitude
                            ),
                            assignedCallLocation: serviceCall == null
                                ? null
                                : new LocationDTO(
                                    latitude: (double)serviceCall.latitude,
                                    longitude: (double)serviceCall.longitude
                                ),
                            respectiveServiceCallId: serviceCall == null
                                ? null
                                : serviceCall!.serviceCallId
                        );
                    }
                ).ToList();

            await SendAllTechnicians(techniciansWithRespectiveCalls);
        }
        catch (Exception)
        {
            await NotifyUser(NotificationType.Error, "Falha ao buscar todos os técnicos no sistema.");
        }
    }

    [Authorize(Policy = "IsInternalUser")]
    public async Task GetAllServiceCalls()
    {
        try
        {
            var technicians = ListGroupActiveConnections(GroupsName.Technicians);
            var serviceCalls = await _serviceCallDAO.GetAllServiceCallsInProgress();

            var serviceCallsList = serviceCalls.ToList();

            List<SpecificServiceCallDTO> callsFormated = serviceCallsList
                .Select(call =>
                {
                    var technician = technicians?.FirstOrDefault(tech => tech.technicianRealTimeDTO?.technician.Id == call.technicianId);

                    return new SpecificServiceCallDTO(
                        serviceCallId: call.serviceCallId,
                        clientTradeName: call.clientTradeName,
                        clientProfileImageUrl: call.clientProfileImageUrl,
                        assignedCallLocation: new LocationDTO(
                            latitude: (double)call.latitude,
                            longitude: (double)call.longitude
                        ),
                        technicianLocation: technician == null
                            ? null
                            : new LocationDTO(
                                    latitude: technician.technicianRealTimeDTO!.latitude,
                                    longitude: technician.technicianRealTimeDTO!.longitude
                            )
                        );
                }
                )
                .ToList();

            await SendAllServiceCalls(callsFormated);
        }
        catch (Exception)
        {
            await NotifyUser(NotificationType.Error, "Falha ao buscar todos os técnicos no sistema.");
        }
    }

    [Authorize(Policy = "IsInternalUser")]
    public async Task GetSpecificTechnician(string technicianIdText)
    {
        try
        {
            var technicianId = Guid.Parse(technicianIdText);

            var technicians = ListGroupActiveConnections(GroupsName.Technicians);

            SpecificTechnicianDTO technicianFormatted = technicians
                .Select(t => new SpecificTechnicianDTO(
                    technicianId: t.technicianRealTimeDTO!.technician.Id,
                    technianName: t.technicianRealTimeDTO.technician.IndividualPerson!.Name!,
                    technicianProfileImageUrl: t.technicianRealTimeDTO.technician.IndividualPerson.User!.ProfileImageUrl!,
                    technicianLocation: new LocationDTO(
                        latitude: t.technicianRealTimeDTO.latitude,
                        longitude: t.technicianRealTimeDTO.longitude
                    ),
                    assignedCallLocation: null,
                    respectiveServiceCallId: null
                 ))
                .FirstOrDefault(t => t.technicianId == technicianId)!;

            SpecificServiceCallDTO? serviceCallFormatted = null!;

            var findedServiceCall = await _serviceCallDAO.GetServiceCallByTechniciaId(technicianId);

            if (findedServiceCall != null)
            {
                serviceCallFormatted = new SpecificServiceCallDTO(
                    serviceCallId: findedServiceCall.serviceCallId,
                    clientTradeName: findedServiceCall.clientTradeName,
                    clientProfileImageUrl: findedServiceCall.clientProfileImageUrl,
                    assignedCallLocation: new LocationDTO(
                        latitude: (double)findedServiceCall.latitude,
                        longitude: (double)findedServiceCall.longitude
                    ),
                    technicianLocation: null
                );
            }

            var response = new GetSpecificTechnicianResponse(
                technician: technicianFormatted,
                assignedServiceCall: serviceCallFormatted
            );

            await Clients.Caller.ReceiveSpecificTechnician(response);
        }
        catch (Exception)
        {
            await NotifyUser(NotificationType.Error, "Falha ao buscar os técnico específico.");
        }
    }

    [Authorize(Policy = "IsInternalUser")]
    public async Task GetSpecificServiceCall(string serviceCallIdText)
    {
        try
        {
            var serviceCallId = Guid.Parse(serviceCallIdText);

            var findedServiceCall = await _serviceCallDAO.GetServiceCallForMapById(serviceCallId);

            if (findedServiceCall == null)
                await NotifyUser(NotificationType.Error, "Falha ao buscar o chamado pelo id.");


            SpecificServiceCallDTO? serviceCallFormatted = new SpecificServiceCallDTO(
                serviceCallId: findedServiceCall!.serviceCallId,
                clientTradeName: findedServiceCall.clientTradeName,
                clientProfileImageUrl: findedServiceCall.clientProfileImageUrl,
                assignedCallLocation: new LocationDTO(
                    latitude: (double)findedServiceCall.latitude,
                    longitude: (double)findedServiceCall.longitude
                ),
                technicianLocation: null
            );

            var technicianId = findedServiceCall.technicianId;

            var technicians = ListGroupActiveConnections(GroupsName.Technicians);

            SpecificTechnicianDTO technicianFormatted = technicians
                .Select(t => new SpecificTechnicianDTO(
                    technicianId: t.technicianRealTimeDTO!.technician.Id,
                    technianName: t.technicianRealTimeDTO.technician.IndividualPerson!.Name!,
                    technicianProfileImageUrl: t.technicianRealTimeDTO.technician.IndividualPerson.User!.ProfileImageUrl!,
                    technicianLocation: new LocationDTO(
                        latitude: t.technicianRealTimeDTO.latitude,
                        longitude: t.technicianRealTimeDTO.longitude
                    ),
                    assignedCallLocation: null,
                    respectiveServiceCallId: null
                 ))
                .FirstOrDefault(t => t.technicianId == technicianId)!;

            var response = new GetSpecificServiceCallResponse(
                serviceCall: serviceCallFormatted,
                assignedTechnician: technicianFormatted
            );

            await Clients.Caller.ReceiveSpecificServiceCall(response);
        }
        catch (Exception)
        {
            await NotifyUser(NotificationType.Error, "Falha ao buscar os técnico específico.");
        }
    }

    [Authorize(Policy = "IsInternalUser")]
    public async Task GetConnectedTechniciansList()
    {
        string connectionId = Context.ConnectionId;

        if (connectionId == null)
            throw new ArgumentNullException("Não foi possivel obter o ConnectionId do usuário.");

        List<TechnicianRealTimeDTO> groupTechniciansRealTimeDTO = ListGroupActiveConnections(GroupsName.Technicians)
            .Select(list => list.technicianRealTimeDTO)
            .ToList()!;

        await SendUpdatedTechniciansList(groupTechniciansRealTimeDTO);
    }


    public async Task<bool> IfTechnicianHasEqualStatus(Guid technicianId, TechnicianStatus technicianStatus)
    {
        try
        {
            Technician? technicianSearched = await _userRepository.GetTechnicianById(technicianId);

            TechnicianStatus? currentStatus = technicianSearched.Status;

            if (currentStatus == null)
                throw new ArgumentNullException("Não foi possível encontrar o técnico desejado.");

            return currentStatus == technicianStatus ? true : false;
        }
        catch (Exception)
        {
            throw;
        }
    }


    [Authorize]
    public async Task<TechnicianRealTimeDTO> ChangeTechnicianStatus(Guid technicianId, int technicianNewStatusId)
    {
        try
        {
            TechnicianStatus newStatus = (TechnicianStatus)technicianNewStatusId;

            // Altera no Banco
            TechnicianRealTimeDTO updatedCallerTechnician = await _userService.UpdateTechnicianStatuById(technicianId, newStatus);

            // Altera no GroupConnections
            var updatedTechnician = _activeUserService.ChangeTechnicianStatusInGroupConnections(technicianId, (TechnicianStatus)technicianNewStatusId);

            // Notifica somente se houver valor na lista
            if (updatedTechnician != null)
                await NotifyTechnicianByConnectionId(updatedTechnician!.connectionId, $"Você agora está {(TechnicianStatus)technicianNewStatusId}");

            return updatedCallerTechnician;
        }
        catch (Exception)
        {
            throw;
        }
    }


    //[Authorize("IsTechnician")]
    public async Task SendMyLocationToSystem(TechnicianActualLocationRequest actualLocation)
    {
        try
        {
            _activeUserService.UpdateTechnicianLocationInGroupConnections(actualLocation);

            // Retorna lista de técnicos atualizada
            await GetTechniciansWithRespectiveCalls();
            await GetAllServiceCalls();
        }
        catch (InvalidOperationException exc)
        {
            await NotifyUser(NotificationType.Error, exc.Message);
        }
        catch (KeyNotFoundException exc)
        {
            await NotifyUser(NotificationType.Error, exc.Message);
        }
        catch (Exception)
        {
            await NotifyUser(NotificationType.Error, "Houve um erro ao enviar a localização ao sistema.");
        }
    }


    [Authorize("IsInternalUser")]
    public async Task SendNewCallAlertToTechnician(Guid technicianId)
    {
        try
        {
            RealTimeConnectedUserDTO technicianFromGroupConnections = _activeUserService.GetTechnicianByIdFromGroupConnections(technicianId)!;

            await NotifyTechnicianByConnectionId(technicianFromGroupConnections!.connectionId, "Você foi designado a um novo serviço, atualize a página para receber as informações.");
        }
        catch (Exception)
        {
            await NotifyUser(NotificationType.Error, "Não foi possível enviar a mensagem para o técnico.");
        }
    }

    public async Task SendUnavailabilityAlertToInternalUsers(UnavailabilityRecord unavailabilityRecord)
    {
        try
        {
            var unavailableTechnician = await _userRepository.GetTechnicianById(unavailabilityRecord.TechnicianId);

            if (unavailableTechnician == null)
                throw new Exception();

            UnavailabilityAlertResponse unavailabilityAlertResponse = new
                (
                    technicianName: unavailableTechnician.IndividualPerson!.Name!,
                    technicianPerfilPhotoUrl: unavailableTechnician.IndividualPerson.User!.ProfileImageUrl!,
                    unavailabilityDescription: unavailabilityRecord.ReasonDescription!,
                    unavailabilityEstimatedDurationTime: unavailabilityRecord.EstimatedDurationTime
                );

            await NotifyUnavailabilityToInternalUsers(unavailabilityAlertResponse);
        }
        catch (Exception)
        {
            await NotifyUser(NotificationType.Error, "Não foi possível enviar a mensagem para a equipe interna.");
        }
    }
}