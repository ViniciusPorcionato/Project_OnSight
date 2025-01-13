using OnSight.Application.Services.Contracts.Requests;
using OnSight.Application.Services.Contracts.Responses;
using OnSight.Domain.Entities;
using OnSight.Infra.Data.DAOs.IndividualPerson;
using OnSight.Infra.Data.DAOs.UserDAO;
using OnSight.Utils.Cryptography;
using OnSight.Utils.DTOs;
using OnSight.Utils.Token;
using OnSight.Domain.Respositories;
using OnSight.Infra.Data.DAOs.IndividualPersonDAO;
using OnSight.Infra.Data.DAOs.ClientDAO;
using OnSight.Infra.Data.UnityOfWork;
using OnSight.Infra.CloudStorage;
using OnSight.Application.Services.CallAssignmentManagerService;
using OnSight.Application.BackgroundJobs;
using OnSight.Application.Services.ServiceCallService;
using OnSight.Infra.Data.DAOs.ServiceCallDAO;

namespace OnSight.Application.Services;

public class UserService : IUserService
{
    private readonly IUserDAO _userDAO;
    private readonly IIndividualPersonDAO _individualPersonDAO;
    private readonly IClientDAO _clientDAO;
    private readonly ITechnicianDAO _technicianDAO;
    private readonly IServiceCallDAO _serviceCallDAO;

    private readonly IUserRepository _userRepository;

    private readonly ICloudStorage _cloudStorage;

    private readonly ICryptographyStrategy _cryptographyStrategy;
    private readonly ITokenStrategy _tokenStrategy;

    private readonly IUnityOfWork _unityOfWork;

    private readonly IServiceCallService _serviceCallService;

    private readonly BackgroundJobsStartup _backgroundJobs;

    public UserService(IUserDAO userDAO, IIndividualPersonDAO individualPersonDAO, IClientDAO clientDAO, ITechnicianDAO technicianDAO, IServiceCallDAO serviceCallDAO, IUserRepository userRepository, ICloudStorage cloudStorage, ICryptographyStrategy cryptographyStrategy, ITokenStrategy tokenStrategy, IUnityOfWork unityOfWork, IServiceCallService serviceCallService, BackgroundJobsStartup backgroundJobs)
    {
        _userDAO = userDAO;
        _individualPersonDAO = individualPersonDAO;
        _clientDAO = clientDAO;
        _technicianDAO = technicianDAO;
        _serviceCallDAO = serviceCallDAO;

        _userRepository = userRepository;

        _cloudStorage = cloudStorage;

        _cryptographyStrategy = cryptographyStrategy;
        _tokenStrategy = tokenStrategy;

        _unityOfWork = unityOfWork;

        _serviceCallService = serviceCallService;

        _backgroundJobs = backgroundJobs;
    }

    public async Task<LoginResponse> Login(LoginRequest request)
    {
        try
        {
            UserLoginDTO findedUser = await _userDAO.GetUserByEmail(request.userEmail);

            if (findedUser == null)
                throw new Exception("Dados inválidos.");

            var hashMatching = _cryptographyStrategy.VerifyHashedPassword(request.userPassword, findedUser.userHash, findedUser.userSalt);

            if (!hashMatching)
                throw new Exception("Dados inválidos.");

            UserTypes userType = (UserTypes)findedUser.userTypeId;

            string userName = "";
            List<KeyValuePair<string, Guid>> additionalUserIds = new List<KeyValuePair<string, Guid>>();

            if (userType == UserTypes.Client)
            {
                var basicClientData = await _clientDAO.GetClientByUserId(findedUser.userId);

                userName = basicClientData.tradeName;
                additionalUserIds.Add(new KeyValuePair<string, Guid>("client_id", basicClientData.clientId));
            }

            if (userType == UserTypes.Administrator
                || userType == UserTypes.Attendant
                || userType == UserTypes.Technician)
            {
                var basicIndividualData = await _individualPersonDAO.GetIndividualPersonByUserId(findedUser.userId);

                userName = basicIndividualData.userName;
                additionalUserIds.Add(new KeyValuePair<string, Guid>("individual_person_id", basicIndividualData.individualPersonId));
            }

            if (userType == UserTypes.Technician)
            {
                Guid technicianId = await _technicianDAO.GetTechnicianIdByUserId(findedUser.userId);

                additionalUserIds.Add(new KeyValuePair<string, Guid>("technicia_id", technicianId));
            }

            var userTokenDTO = new UserTokenDTO(
                userId: findedUser.userId,
                userName: userName,
                userTypeId: (int)userType,
                profileImageUrl: findedUser.profileImageUrl,
                additionalIds: additionalUserIds
            );

            var loginToken = _tokenStrategy.GenerateToken(userTokenDTO);

            return new LoginResponse(loginToken);
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<IEnumerable<AllClientResponse>> GetAllClients()
    {
        try
        {
            List<ClientListDTO> clients = (List<ClientListDTO>)await _clientDAO.GetAllClients();

            if (clients.Count == 0)
                throw new Exception("Não há nenhum cliente salvo.");

            IEnumerable<AllClientResponse> clientResponses = clients.Select(client => new AllClientResponse(
                client.userId,
                client.clientId,
                client.userTypeId,
                client.profileImageUrl,
                client.tradeName,
                client.clientEmail,
                client.clientPhoneNumber
                )
            );

            return clientResponses;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<ClientDetailsResponse> GetClientDetailsById(Guid clientId)
    {
        try
        {
            ClientDetailsDTO searchedClient = await _clientDAO.GetClientById(clientId)
                ?? throw new Exception("Nenhum usuário encontrado com o id informado.");

            return new ClientDetailsResponse(
                //searchedClient.clientId,
                searchedClient.userTypeId,
                searchedClient.clientProfileImage,
                searchedClient.clientUserEmail,
                searchedClient.clientUserPhoneNumber,
                searchedClient.tradeName,
                searchedClient.companyName,
                searchedClient.cnpj);
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<IEnumerable<AllIndividualPersonResponse>> GetIndividualPersonsByType(int userTypeId)
    {
        try
        {
            List<IndividualPersonListDTO> individualPersonsList = (List<IndividualPersonListDTO>)await _individualPersonDAO.GetIndividualPersonsByType(userTypeId);

            //if (individualPersonsList.Count == 0)
            //    throw new Exception("Não há nenhuma pessoa física do tipo inserido.");

            IEnumerable<AllIndividualPersonResponse> individualPersonsResponses = individualPersonsList.Select(person => new AllIndividualPersonResponse
                (
                    person.individualPersonId,
                    person.userId,
                    person.userTypeId,
                    person.profileImageUrl,
                    person.email,
                    person.phoneNumber,
                    person.userName
                )
            );

            return individualPersonsResponses;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<RegisterIndividualPersonResponse> RegisterIndividualPerson(RegisterIndividualPersonRequest request)
    {
        try
        {
            var passwordSalt = _cryptographyStrategy.MakeSalt();
            var passwordHash = _cryptographyStrategy.MakeHashedPassword(request.password, passwordSalt);

            string? profileImageUrl = null;

            if (request.profileImage != null)
            {
                profileImageUrl = await _cloudStorage.UploadData(request.profileImage);
            }

            var user = new User(
                userType: request.userType,
                email: request.email,
                phoneNumber: request.phoneNumber,
                passwordHash: passwordHash,
                passwordSalt: passwordSalt,
                profileImageUrl: profileImageUrl
            );

            await _userRepository.RegisterUser(user);

            var individualPerson = new IndividualPerson(
                userId: user.Id,
                name: request.name,
                cpf: request.cpf,
                rg: request.rg,
                birthDate: request.birthDate
            );

            await _userRepository.RegisterIndividualPerson(individualPerson);

            if (request.userType == UserTypes.Technician)
            {
                var technician = new Technician(
                    technicianStatus: TechnicianStatus.Offline,
                    individualPersonId: individualPerson.Id
                );

                await _userRepository.RegisterTechnician(technician);
            }

            await _unityOfWork.Commit();

            var response = new RegisterIndividualPersonResponse(
                userId: user.Id,
                profileImageUrl: user.ProfileImageUrl!,
                name: individualPerson.Name!,
                email: user.Email!,
                phoneNumber: user.PhoneNumber!
            );


            return response;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<IndividualPersonDetailsResponse> GetIndividualPersonById(Guid individualPersonId)
    {
        try
        {
            IndividualPersonDetailsDTO personDTO = await _individualPersonDAO.GetIndividualPersonById(individualPersonId);

            if (personDTO == null)
                throw new Exception("Nenhum usuário encontrado com este id.");

            IndividualPersonDetailsResponse personResponse = new IndividualPersonDetailsResponse
                (
                    personDTO.userTypeId,
                    personDTO.profileImageUrl,
                    personDTO.email,
                    personDTO.phoneNumber,
                    personDTO.userName,
                    personDTO.cpf,
                    personDTO.rg,
                    personDTO.birthDate
                );

            return personResponse;

        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<TechnicianRealTimeDTO> UpdateTechnicianStatuById(Guid technicianId, TechnicianStatus technicianStatus)
    {
        try
        {
            // Busca o usuário para futura alteração
            var searchedTechnician = await _userRepository.GetTechnicianById(technicianId);

            if (searchedTechnician == null)
                throw new Exception("Técnico não encontrado!");

            // Altera o status
            searchedTechnician.Status = technicianStatus;

            // Persiste a alteração
            await _userRepository.UpdateTechnicianStatus(searchedTechnician);
            await _unityOfWork.Commit();

            TechnicianRealTimeDTO formattedSearchedTechnician = new(searchedTechnician, 0, 0);

            return formattedSearchedTechnician;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<IEnumerable<TechniciansListResponse>> GetTechniciansByFilterAndSearch(string? textToSearch = null, int technicianStatusId = 0)
    {
        try
        {
            var techniciansList = await _technicianDAO.GetTechniciansWithFilterAndSearch(textToSearch!, technicianStatusId);

            var techniciansListResponse = techniciansList.Select(technician => new TechniciansListResponse
            (
                technician.technicianId,
                technician.individualPersonId,
                technician.userId,
                technician.nameTechnician,
                technician.photoUrlTechnician,
                technician.technicianStatusId
            ));

            return techniciansListResponse;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<RegisterClientResponse> RegisterClient(RegisterClientRequest request)
    {
        try
        {
            var passwordSalt = _cryptographyStrategy.MakeSalt();
            var passwordHash = _cryptographyStrategy.MakeHashedPassword(request.password, passwordSalt);

            string? profileImageUrl = null;

            if (request.profileImage != null)
            {
                profileImageUrl = await _cloudStorage.UploadData(request.profileImage);
            }

            var user = new User(
                userType: UserTypes.Client,
                email: request.email,
                phoneNumber: request.phoneNumber,
                passwordHash: passwordHash,
                passwordSalt: passwordSalt,
                profileImageUrl: profileImageUrl
            );

            await _userRepository.RegisterUser(user);

            var client = new Client(
                userId: user.Id,
                tradeName: request.tradeName,
                companyName: request.companyName,
                cnpj: request.cnpj
            );

            await _userRepository.RegisterClient(client);

            await _unityOfWork.Commit();

            var response = new RegisterClientResponse(
                userId: user.Id,
                profileImageUrl: user.ProfileImageUrl!,
                tradeName: client.TradeName!,
                email: user.Email!,
                phoneNumber: user.PhoneNumber!
            );

            return response;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<UnavailabilityRecord?> RegisterUnavaliability(RegisterUnavaliabilityRequest request)
    {
        try
        {
            var findedTechnician = await _userRepository.GetTechnicianById(request.technicianId);

            if (findedTechnician == null)
                throw new ArgumentException("The technician does not exists.");

            if (findedTechnician.Status == TechnicianStatus.Offline || findedTechnician.Status == TechnicianStatus.Unavaliable)
                throw new Exception("The technician should be avaliable or working to make yourself unavaliable");

            findedTechnician.MakeUnnavaliable();

            var unavaliabilityRecord = new UnavailabilityRecord(
                technicianId: request.technicianId,
                reasonDescription: request.reasonDescription,
                estimatedDurationTime: request.estimatedDurationTime
            );

            await _userRepository.RegisterUnavailabilityRecord(unavaliabilityRecord);

            _backgroundJobs.ScheduleBackgroundJob(
                callback: () => MakeTechnicianAvaliableAgain(request.technicianId),
                timeToExecute: request.estimatedDurationTime.ToTimeSpan()
            );

            await _unityOfWork.Commit();

            var callAtributtedToTechnician = await _serviceCallDAO.GetServiceCallByTechniciaId(request.technicianId);

            if (callAtributtedToTechnician == null)
                return null;

            _backgroundJobs.AddBackgroundJob(
                callback: () => _serviceCallService.ReassignTechnicianToCall(callAtributtedToTechnician.serviceCallId)
            );

            return unavaliabilityRecord;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task MakeTechnicianAvaliableAgain(Guid technicianId)
    {
        var technician = await _userRepository.GetTechnicianById(technicianId);

        technician.MakeAvaliable();

        await _unityOfWork.Commit();
    }

    public async Task RemoveClientById(Guid idUser)
    {
        try
        {
            User userToDelete = await _userRepository.GetUserById(idUser);

            if (userToDelete == null)
                throw new Exception("Usuário com este id não encontrado.");

            _userRepository.RemoveIndividualPerson(userToDelete);
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<int> GetTechnicianStatusCodeById(Guid technicianId)
    {
        try
        {
            return await _technicianDAO.GetTechnicianStatusCodeById(technicianId);
        }
        catch (Exception)
        {
            throw;
        }
    }
}
