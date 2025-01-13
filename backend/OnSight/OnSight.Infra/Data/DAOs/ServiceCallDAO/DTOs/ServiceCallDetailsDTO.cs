using OnSight.Domain.Entities;

namespace OnSight.Infra.Data.DAOs.ServiceCallDAO.DTOs;

public record ServiceCallDetailsDTO
(
    Guid serviceCallId,
    Guid clientId,
    Guid userId,
    int callStatusId,
    string callCode,
    DateTime creationDateTime,
    int serviceTypeId,
    string phoneNumberClient,
    string emailClient,
    string addressCep,
    string addressNumber,
    string addressComplement,
    bool isRecurring,
    DateTime? conclusionDateTime,
    string description,
    int urgencyStatusId,
    string clientTradeName,
    string clientPhotoImgUrl,
    string? responsibleAttendantName,
    DateTime? deadLine
);