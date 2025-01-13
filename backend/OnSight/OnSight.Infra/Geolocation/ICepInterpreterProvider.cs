using OnSight.Infra.Geolocation.DTOs;

namespace OnSight.Infra.Geolocation;

public interface ICepInterpreterProvider
{
    Task<ViaCepAddressDTO> GetAddressFromCep(string cep);
}
