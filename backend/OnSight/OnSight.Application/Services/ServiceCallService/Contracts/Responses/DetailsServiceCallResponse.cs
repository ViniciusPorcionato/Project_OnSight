namespace OnSight.Application.Services.ServiceCallService.Contracts.Responses;

public record DetailsServiceCallResponse
(
    Guid serviceCallId,
    string callCode,
    int callStatusId,
    DateTime creationDateTime,
    int serviceTypeId,
    string phoneNumberClient,
    string emailClient,
    string addressCep,
    string addressStreet,
    string addressNeightborhood,
    string addressCity,
    string addressNumber,
    string addressComplement,
    bool isRecurring,
    DateTime? conclusionDateTime,
    int urgencyStatusId,
    string description,
    string? clientName,
    string? clientPhotoImgUrl,
    string responsibleAttendantName,
    DateTime? deadLine
);
