using Microsoft.Extensions.Configuration;
using OnSight.Infra.Geolocation.DTOs;
using System.Net.Http.Json;
using System.Text.Json;

namespace OnSight.Infra.Geolocation;

public class GoogleMapsProvider : IGeolocationProvider
{
    private const string LANGUAGE = "pt-BR";
    private const string TRAVEL_MODE = "driving";
    private const string DEPARTURE_TIME = "now";

    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public GoogleMapsProvider(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri("https://maps.googleapis.com/maps/api/");

        IConfigurationRoot config = new ConfigurationBuilder()
            .AddUserSecrets<GoogleMapsProvider>()
            .Build();

        _apiKey = config["GoogleMaps:ApiKey"]!;
    }

    public async Task<DistanceMatrixDTO> GetDistanceBetweenPlaces(Location[] origins, string destination)
    {
        try
        {
            string originsParam = string.Join("|",
                origins.Select(o => $"{o.latitude},{o.longitude}"));

            string url = $"distancematrix/json?origins={originsParam}&destinations={Uri.EscapeDataString(destination)}&departure_time={DEPARTURE_TIME}&language={LANGUAGE}&mode={TRAVEL_MODE}&key={_apiKey}";

            System.Console.WriteLine(url);

            var response = await _httpClient.GetFromJsonAsync<DistanceMatrixDTO>(url);

            return response!;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<Location> GetGeocodingLocationByAddress(string address)
    {
        try
        {
            string escapedAddress = Uri.EscapeDataString(address);
            string url = $"geocode/json?address={escapedAddress}&key={_apiKey}";

            var responseText = await _httpClient.GetStringAsync(url);

            using var documentResponse = JsonDocument.Parse(responseText);
            var documentRoot = documentResponse.RootElement;

            var status = documentRoot.GetProperty("status").GetString();

            if (status != "OK")
                return null!;

            var location = documentRoot.GetProperty("results")[0]
                .GetProperty("geometry")
                .GetProperty("location");

            var latitude = location.GetProperty("lat").GetDouble();
            var longitude = location.GetProperty("lng").GetDouble();

            return new Location(latitude, longitude);
        }
        catch (Exception)
        {
            throw;
        }
    }
}
