namespace OnSight.Application.Services.Contracts.Responses;

public record TechniciansListResponse
(
    Guid technicianId,
    Guid individualPersonId,
    Guid userId,
    string nameTechnician,
    string photoUrlTechnician,
    int technicianStatusId
);
