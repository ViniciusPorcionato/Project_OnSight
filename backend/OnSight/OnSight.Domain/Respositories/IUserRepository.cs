using OnSight.Domain.Entities;

namespace OnSight.Domain.Respositories;

public interface IUserRepository
{
    Task RegisterClient(Client client);
    Task RegisterIndividualPerson(IndividualPerson individualPerson);
    Task RegisterUser(User user);
    Task RegisterTechnician(Technician technician);
    Task RegisterUnavailabilityRecord(UnavailabilityRecord unavailabilityRecord);
    void RemoveIndividualPerson(User userToDelete);
    Task<User> GetUserById(Guid idUser);
    Task<Technician> GetTechnicianById(Guid? technicianId);
    Task UpdateTechnicianStatus(Technician updatedStatusTechnician);
}
