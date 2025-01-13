namespace OnSight.Application.Services.Contracts.Responses;

public record RegisterClientResponse
(
    Guid userId,
    string profileImageUrl,
    string tradeName,
    string email,
    string phoneNumber
);
