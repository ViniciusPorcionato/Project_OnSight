namespace OnSight.Application.Services.Contracts.Responses;

public record AllClientResponse
(
    Guid userId,
    Guid clientId,
    int userTypeId,
    string? profileImageUrl,
    string? tradeName,
    string? clientEmail,
    string? clientPhoneNumber
);
