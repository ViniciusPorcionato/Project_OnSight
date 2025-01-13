namespace OnSight.Application.Services.Contracts.Responses;
public record AllIndividualPersonResponse
(
    Guid idIndividualPerson,
    Guid userId,
    int userTypeId,
    string? profileImageUrl,
    string? email,
    string? phoneNumber,
    string? userName
);