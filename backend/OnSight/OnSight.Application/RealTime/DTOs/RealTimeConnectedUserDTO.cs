using OnSight.Application.Services.CallAssignmentManagerService;

namespace OnSight.Application.RealTime.DTOs;

public record RealTimeConnectedUserDTO
(
    string connectionId,
    Guid userId,
    TechnicianRealTimeDTO? technicianRealTimeDTO
);