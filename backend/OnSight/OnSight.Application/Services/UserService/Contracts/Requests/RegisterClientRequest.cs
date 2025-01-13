namespace OnSight.Application.Services.Contracts.Requests;

public record RegisterClientRequest
(
    string tradeName,
    string companyName,
    string cnpj,
    string phoneNumber,
    string email,
    string password,
    IFormFile? profileImage
);
