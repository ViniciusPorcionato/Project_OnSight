namespace OnSight.Infra.Data.DAOs.ServiceCallDAO.DTOs;

public record CallHistoryDTO
(
    Guid idServiceCall,
    int callStatusId,
    DateTime creationDateTime,
    string callDescription,
    int callServiceTypeId,
    int callUrgencyStatusId,
    Guid clientId,
    string tradeName,
    string profileImageUrl
);