namespace OnSight.Infra.Geolocation.DTOs;
public record DistanceElementDTO
(
    string status,
    DistanceValueDto distance,
    DistanceValueDto duration
);