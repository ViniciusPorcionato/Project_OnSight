using OnSight.Infra.Geolocation.DTOs;

namespace OnSight.Infra.Geolocation;

public interface IGeolocationProvider
{
    Task<DistanceMatrixDTO> GetDistanceBetweenPlaces(Location[] origins, string destination);
    Task<Location> GetGeocodingLocationByAddress(string address);
}

public record Location
(
    double latitude,
    double longitude
);
