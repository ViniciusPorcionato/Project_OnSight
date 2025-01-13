using OnSight.Infra.Data.DAOs.IndividualPerson;

namespace OnSight.Application.Services.Contracts.Responses;

public record IndividualPersonDetailsResponse
(
    int? userTypeId,
    string? profileImageUrl,
    string? email,
    string? phoneNumber,
    string? userName,
    string? cpf,
    string? rg,
    DateTime? birthDate
);