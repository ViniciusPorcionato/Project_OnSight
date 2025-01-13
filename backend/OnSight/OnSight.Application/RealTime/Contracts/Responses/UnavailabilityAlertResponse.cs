namespace OnSight.Application.RealTime.Contracts.Responses;

public record UnavailabilityAlertResponse
(
    string technicianName,
    string technicianPerfilPhotoUrl,
    string unavailabilityDescription,
    TimeOnly unavailabilityEstimatedDurationTime
);