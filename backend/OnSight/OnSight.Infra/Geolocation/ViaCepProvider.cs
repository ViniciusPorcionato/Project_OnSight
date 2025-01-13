using System.Net.Http.Json;
using OnSight.Infra.Geolocation.DTOs;

namespace OnSight.Infra.Geolocation;

public class ViaCepProvider : ICepInterpreterProvider
{
    private readonly HttpClient _httpClient;

    public ViaCepProvider(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri("https://viacep.com.br/ws/");
    }

    public async Task<ViaCepAddressDTO> GetAddressFromCep(string cep)
    {
        try
        {
            string url = $"{cep}/json/";

            var response = await _httpClient.GetFromJsonAsync<ViaCepAddressDTO>(url);

            return response!;
        }
        catch (Exception)
        {
            throw;
        }
    }
}
