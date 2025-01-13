using OnSight.Domain.Entities;

namespace OnSight.Application.Services.Contracts.Requests;

public record AttendantRevisionUpdateRequest
(
    Guid serviceCallId,
    Guid responsibleAttendentId,
    DateOnly deadline,
    string? serviceCallDescription,
    ServiceTypes? serviceType,
    UrgencyStatuses urgencyStatus,
    string? instantSolutionDescription,
    bool isCallApproved
);
