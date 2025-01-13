namespace OnSight.Application.Services.ServiceCallService.Contracts.Responses;
public record OpenedServiceCallResponse
(
    Guid idServiceCall,
    string tradeName,
    int serviceCallTypeId,
    DateTime serviceCallCreationDate
);