namespace OnSight.Application.Services.Contracts.Responses;

public record ClientDetailsResponse
(
    //Guid clientId,
    int userTypeId,
    string? clientProfileImage,
    string? clientUserEmail,
    string? clientUserPhoneNumber,
    string? tradeName,
    string? companyName,
    string? cnpj
);
