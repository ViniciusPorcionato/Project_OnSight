namespace OnSight.Infra.Data.DAOs.ClientDAO;

public record ClientListDTO
(
    Guid userId,
    Guid clientId,
    int userTypeId,
    string? profileImageUrl,
    string? tradeName,
    string? clientEmail,
    string? clientPhoneNumber
);