namespace OnSight.Infra.Data.DAOs.ServiceCallDAO.DTOs;

public record ServiceCallDTO
(
    Guid serviceCallId,
    Guid clientId,
    string clientPhotoUrl,
    string clientTradeName,
    int callTypeId,
    int callStatusId
);