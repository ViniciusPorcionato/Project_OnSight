namespace OnSight.Infra.Data.DAOs.ServiceCallDAO.DTOs;

public record CallForMapViewDTO
(
    Guid serviceCallId,
    string clientTradeName,
    string clientProfileImageUrl,
    decimal latitude,
    decimal longitude,
    Guid technicianId
);
