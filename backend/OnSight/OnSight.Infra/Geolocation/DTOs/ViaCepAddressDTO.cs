namespace OnSight.Infra.Geolocation.DTOs;

public record ViaCepAddressDTO
(
    string logradouro,
    string bairro,
    string localidade,
    string uf,
    string estado,
    string regiao,
    string ibge,
    string gia,
    string ddd,
    string siafi
);
