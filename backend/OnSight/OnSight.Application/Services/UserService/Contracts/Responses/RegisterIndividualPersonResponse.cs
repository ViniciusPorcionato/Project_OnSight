namespace OnSight.Application.Services.Contracts.Responses;

public record RegisterIndividualPersonResponse
(
    Guid userId,
    string profileImageUrl,
    string name,
    string email,
    string phoneNumber
);