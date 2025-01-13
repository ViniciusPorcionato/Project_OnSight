namespace OnSight.Infra.Data.DAOs.IndividualPerson;
public record IndividualPersonListDTO
(
    Guid individualPersonId,
    Guid userId,
    int userTypeId,
    string? profileImageUrl,
    string? userName,
    string? email,
    string? phoneNumber
);