using OnSight.Domain.Entities;

namespace OnSight.Application.Services.Contracts.Requests;

public record RegisterServiceCallRequest
(
    Guid clientId,
    string contactEmail,
    string contactPhoneNumber,
    string addressCEP,
    string addressNumber,
    string addressComplement,
    ServiceTypes serviceType,
    string callReasonDescription,
    bool isRecurringCall
);
