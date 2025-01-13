using OnSight.Application.Services.CallAssignmentManagerService;

namespace OnSight.Application.RealTime.Contracts.Requests;

public record JoinGroupRequest
(
    Guid userId,
    GroupsName groupName,
    TechnicianRealTimeDTO? technicianRealTimeDTO
);

public enum GroupsName : int
{
    InternalUsers, // Administradores/Atendentes
    Technicians // Técnicos
}