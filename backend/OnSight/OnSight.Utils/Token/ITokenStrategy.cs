using OnSight.Utils.DTOs;

namespace OnSight.Utils.Token
{
    public interface ITokenStrategy
    {
        string GenerateToken(UserTokenDTO user);
    }
}
