namespace OnSight.Infra.Geolocation.DTOs;

public record DistanceMatrixDTO
(
    string[] destinationAddresses,
    string[] originAddresses,
    DistanceRowDTO[] rows
);
