using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using OnSight.Utils.DTOs;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace OnSight.Utils.Token;

public class TokenStrategy : ITokenStrategy
{
    private readonly string SecurityKey;
    private readonly int TokenExpirationHours;

    public TokenStrategy()
    {
        IConfigurationRoot config = new ConfigurationBuilder()
            .AddUserSecrets<TokenStrategy>()
            .Build();

        SecurityKey = config["Token:SecurityKey"]!;
        TokenExpirationHours = int.Parse(config["Token:HoursToExpiration"]!);
    }

    public string GenerateToken(UserTokenDTO user)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(SecurityKey);

            List <Claim> claims =
            [
                new Claim(JwtRegisteredClaimNames.Jti, user.userId.ToString()),
                new Claim(ClaimTypes.Name, user.userName),
                new Claim("profile_image_url", user.profileImageUrl == null ? "" : user.profileImageUrl),
                new Claim(ClaimTypes.Role, user.userTypeId.ToString()),
            ];

            foreach(var additionalId in user.additionalIds)
            {
                claims.Add(new Claim(additionalId.Key, additionalId.Value.ToString()));
            }

            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(TokenExpirationHours),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
        catch (Exception)
        {
            throw;
        }
    }
}