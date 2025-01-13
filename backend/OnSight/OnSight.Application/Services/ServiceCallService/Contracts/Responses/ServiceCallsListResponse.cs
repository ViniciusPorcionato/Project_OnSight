namespace OnSight.Application.Services.ServiceCallService.Contracts.Responses;

public record ServiceCallsListResponse
(
    Guid serviceCallId,
    Guid clientId,
    string clientPhotoUrl,
    string clientTradeName,
    int serviceCallTypeId,
    int serviceCallStatusId
);
