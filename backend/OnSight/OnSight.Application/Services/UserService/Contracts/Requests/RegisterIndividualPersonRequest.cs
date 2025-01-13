using OnSight.Domain.Entities;

namespace OnSight.Application.Services.Contracts.Requests;

public record RegisterIndividualPersonRequest
(
    string name,
    string rg,
    string cpf,
    DateOnly birthDate,
    string phoneNumber,
    UserTypes userType,
    string email,
    string password,
    IFormFile? profileImage
);