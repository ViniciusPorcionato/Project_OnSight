namespace OnSight.Application.RealTime.DTOs;

public record SpecificServiceCallDTO(
    Guid serviceCallId,
    string clientTradeName,
    string clientProfileImageUrl,
    LocationDTO assignedCallLocation,
    LocationDTO? technicianLocation
);