using OnSight.Domain.Entities;

namespace OnSight.Infra.Data.DAOs.UserDAO;

public interface IUserDAO
{
    Task<UserLoginDTO> GetUserByEmail(string userEmail);
}