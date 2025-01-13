namespace OnSight.Infra.Data.DAOs.ServiceCallDAO.DTOs;

public record CurrentServiceCallDTO
(
    Guid serviceCallId,
    int technicianStatus
);
