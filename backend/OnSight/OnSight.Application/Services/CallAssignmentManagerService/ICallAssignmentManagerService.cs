using OnSight.Domain.Entities;

namespace OnSight.Application.Services.CallAssignmentManagerService;

public interface ICallAssignmentManagerService
{
    Task<TechnicianSelectedForDTO> AttributeServiceCallForTechnician(ServiceCall serviceCall, TechnicianRealTimeDTO[] avaliableTechnicians);
}
