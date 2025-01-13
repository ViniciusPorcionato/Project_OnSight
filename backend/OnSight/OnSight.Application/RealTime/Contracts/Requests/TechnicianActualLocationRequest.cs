namespace OnSight.Application.RealTime.Contracts.Requests;

public record TechnicianActualLocationRequest
(
    Guid idTechnician,
    double latitude,
    double longitude
);