using Microsoft.EntityFrameworkCore;
using OnSight.Domain.Entities;
using OnSight.Domain.Respositories;

namespace OnSight.Infra.Data.Repositories;

public class UserRepository : IUserRepository
{
    private readonly DataContext _context;

    public UserRepository(DataContext context)
    {
        _context = context;
    }

    public async Task RegisterClient(Client client)
    {
        await _context.Clients!.AddAsync(client);
    }

    public async Task RegisterIndividualPerson(IndividualPerson individualPerson)
    {
        await _context.IndividualPersons!.AddAsync(individualPerson);
    }

    public async Task RegisterTechnician(Technician technician)
    {
        await _context.Technicians!.AddAsync(technician);
    }

    public async Task RegisterUnavailabilityRecord(UnavailabilityRecord unavailabilityRecord)
    {
        await _context.UnavailabilityRecords!.AddAsync(unavailabilityRecord);
    }

    public async Task RegisterUser(User user)
    {
        await _context.Users!.AddAsync(user);
    }

    public void RemoveIndividualPerson(User userToDelete)
    {
        _context.Users!.Remove(userToDelete);
    }

    public async Task<User> GetUserById(Guid idUser)
    {
        return (await _context.Users!.FirstOrDefaultAsync(u => u.Id == idUser))!;
    }

    public async Task<Technician> GetTechnicianById(Guid? technicianId)
    {
        if (technicianId == null)
            return null!;

        var technician = (await _context.Technicians!
            .Include(t => t.IndividualPerson)
            .Include(t => t.IndividualPerson!.User)
            .FirstOrDefaultAsync(t => t.Id == technicianId))!;

        return technician;
    }

    public async Task UpdateTechnicianStatus(Technician updatedStatusTechnician)
    {
        _context.Technicians!.Update(updatedStatusTechnician);
    }
}
