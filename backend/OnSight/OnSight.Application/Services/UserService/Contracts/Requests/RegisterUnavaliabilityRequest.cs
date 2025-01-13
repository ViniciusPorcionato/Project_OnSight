namespace OnSight.Application.Services.Contracts.Requests;

public record RegisterUnavaliabilityRequest
(
    Guid technicianId,
    string reasonDescription,
    TimeOnly estimatedDurationTime
);