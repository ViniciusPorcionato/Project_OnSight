using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace OnSight.Infra.Data.DAOs.UserDAO;

public class UserDAO : IUserDAO
{
    private readonly string _connectionString;

    public UserDAO()
    {
        IConfigurationRoot config = new ConfigurationBuilder()
            .AddUserSecrets<UserDAO>()
            .Build();

        _connectionString = config["ConnectionStrings:AzurePostgresDB"]!;
    }

    public async Task<UserLoginDTO> GetUserByEmail(string userEmail)
    {
        try
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                string query = @"
                    SELECT
                        users.id AS userId,
                        users.password_hash AS userHash,
                        users.password_salt AS userSalt,
                        users.user_type_id AS userTypeId,
                        users.profile_image_url AS profileImageUrl
                    FROM users
                    WHERE users.email = @email
                ";

                return (await connection.QueryFirstOrDefaultAsync<UserLoginDTO>(query, new { email = userEmail }))!;
            }
        }
        catch (Exception)
        {
            throw;
        }
    }
}
