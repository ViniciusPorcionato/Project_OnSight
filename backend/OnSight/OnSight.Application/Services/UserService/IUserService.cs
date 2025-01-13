using OnSight.Application.Services.CallAssignmentManagerService;
using OnSight.Application.Services.Contracts.Requests;
using OnSight.Application.Services.Contracts.Responses;
using OnSight.Domain.Entities;

namespace OnSight.Application.Services;

public interface IUserService
{
    // Posts
    Task<RegisterIndividualPersonResponse> RegisterIndividualPerson(RegisterIndividualPersonRequest request);
    Task<RegisterClientResponse> RegisterClient(RegisterClientRequest request);
    Task<LoginResponse> Login(LoginRequest request);

    // GET - Clients
    Task<IEnumerable<AllClientResponse>> GetAllClients();
    Task<ClientDetailsResponse> GetClientDetailsById(Guid clientId);
    Task<UnavailabilityRecord?> RegisterUnavaliability(RegisterUnavaliabilityRequest request);

    // GET - Individual Persons
    Task<IEnumerable<AllIndividualPersonResponse>> GetIndividualPersonsByType(int userTypeId);
    Task<IndividualPersonDetailsResponse> GetIndividualPersonById(Guid id);
    Task RemoveClientById(Guid idUser);

    // GET - technician
    Task<TechnicianRealTimeDTO> UpdateTechnicianStatuById(Guid technicianId, TechnicianStatus technicianStatus);
    Task<IEnumerable<TechniciansListResponse>> GetTechniciansByFilterAndSearch(string? textToSearch = null, int technicianStatusId = 0);
    Task<int> GetTechnicianStatusCodeById(Guid technicianId);
}
