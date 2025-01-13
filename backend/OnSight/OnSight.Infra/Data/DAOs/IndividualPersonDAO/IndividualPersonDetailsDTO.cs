namespace OnSight.Infra.Data.DAOs.IndividualPerson;

public record IndividualPersonDetailsDTO
(
    Guid idIndividualPerson,
    Guid userId,
    int userTypeId,
    string profileImageUrl,
    string email,
    string phoneNumber,
    string userName,
    string cpf,
    string rg,
    DateTime birthDate
);