using OnSight.Domain.Entities;

namespace OnSight.Application.RealTime.Contracts.Requests;

public record AddTechnicianAvailableListRequest
(
    Guid technicianId,
    Guid individualPersonId,
    int statusId,
    double latitude,
    double longitude
);
