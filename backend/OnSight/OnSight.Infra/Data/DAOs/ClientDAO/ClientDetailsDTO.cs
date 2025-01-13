namespace OnSight.Infra.Data.DAOs.ClientDAO;

public record ClientDetailsDTO
(
    Guid clientId,
    int userTypeId,
    Guid clientUserId,
    string? clientProfileImage,
    string? clientUserEmail,
    string? clientUserPhoneNumber,
    string? tradeName,
    string? companyName,
    string? cnpj
);
