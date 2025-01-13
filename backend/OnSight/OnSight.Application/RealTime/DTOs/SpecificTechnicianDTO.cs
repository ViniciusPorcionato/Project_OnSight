namespace OnSight.Application.RealTime.DTOs;

public record SpecificTechnicianDTO(
    Guid technicianId,
    string technianName,
    string technicianProfileImageUrl,
    LocationDTO technicianLocation,
    LocationDTO? assignedCallLocation,
    Guid? respectiveServiceCallId
);