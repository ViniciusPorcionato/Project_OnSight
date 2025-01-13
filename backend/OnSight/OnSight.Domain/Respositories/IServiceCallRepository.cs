using OnSight.Domain.Entities;

namespace OnSight.Domain.Respositories;

public interface IServiceCallRepository
{
    Task RegisterAddress(Address address);
    Task RegisterServiceCall(ServiceCall serviceCall);
    Task<ServiceCall> GetServiceCallById(Guid serviceCallId);
}
