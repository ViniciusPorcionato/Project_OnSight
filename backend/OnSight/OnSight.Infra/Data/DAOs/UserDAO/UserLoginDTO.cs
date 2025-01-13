namespace OnSight.Infra.Data.DAOs.UserDAO;

public record UserLoginDTO
(
    Guid userId,
    byte[] userHash,
    byte[] userSalt,
    int userTypeId,
    string? profileImageUrl
);