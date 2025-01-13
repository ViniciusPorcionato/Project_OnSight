namespace OnSight.Application.Services.ServiceCallService.Contracts.Responses;
public record ServiceCallHistoryResponse
(
    Guid idServiceCall,
    int callStatusId,
    DateTime creationDateTime,
    string callDescription,
    int callServiceTypeId,
    int callUrgencyStatusId,
    //Guid clientId,
    string tradeName,
    string profileImageUrl
);