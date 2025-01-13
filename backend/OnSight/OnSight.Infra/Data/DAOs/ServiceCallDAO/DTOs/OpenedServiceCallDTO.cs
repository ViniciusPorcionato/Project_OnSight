using OnSight.Domain.Entities;

namespace OnSight.Infra.Data.DAOs.ServiceCallDAO.DTOs;
public record OpenedServiceCallDTO
(
    Guid idServiceCall,
    Guid clientId,
    string clientPhotoUrl,
    string tradeName,
    int serviceCallTypeId,
    int serviceCallStatusId,
    DateTime serviceCallCreationDateTime
);