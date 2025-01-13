namespace OnSight.Utils.DTOs;

public record UserTokenDTO
(
    Guid userId,
    string userName,
    int userTypeId,
    string? profileImageUrl,
    List<KeyValuePair<string, Guid>> additionalIds
);