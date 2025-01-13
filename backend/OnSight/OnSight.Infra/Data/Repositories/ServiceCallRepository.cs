using Microsoft.EntityFrameworkCore;
using OnSight.Domain.Entities;
using OnSight.Domain.Respositories;

namespace OnSight.Infra.Data.Repositories;

public class ServiceCallRepository : IServiceCallRepository
{
    private readonly DataContext _context;

    public ServiceCallRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<ServiceCall> GetServiceCallById(Guid serviceCallId)
    {
        var serviceCall = await _context.ServiceCalls!
            .Include(serviceCall => serviceCall.Address)
            .Include(serviceCall => serviceCall.Client)
            .Include(serviceCall => serviceCall.Client!.User)
            .FirstOrDefaultAsync(call => call.Id == serviceCallId)!;

        return serviceCall!;
    }

    public async Task RegisterAddress(Address address)
    {
        await _context.AddAsync(address);
    }

    public async Task RegisterServiceCall(ServiceCall serviceCall)
    {
        await _context.AddAsync(serviceCall);
    }
}