using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace OnSight.Infra.Data.DAOs.ClientDAO;

public class ClientDAO : IClientDAO
{
    private readonly string _connectionString;

    public ClientDAO()
    {
        IConfigurationRoot config = new ConfigurationBuilder()
            .AddUserSecrets<ClientDAO>()
            .Build();

        _connectionString = config["ConnectionStrings:AzurePostgresDB"]!;
    }

    /// <summary>
    /// Busca todos os clientes existentes (retorna propriedades específicas - ClientListDTO)
    /// </summary>
    /// <returns>Lista de ClientListDTOs</returns>
    public async Task<IEnumerable<ClientListDTO>> GetAllClients()
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            string query = @"
                    SELECT 
                           users.id AS userId,
                           clients.id AS clientId,
                           users.user_type_id AS userTypeId,
                           users.profile_image_url AS profileImageUrl,
                           trade_name AS tradeName,
                           users.email AS clientEmail,
                           users.phone_number AS clientPhoneNumber
	                    FROM clients
                    INNER JOIN users
	                    ON clients.user_id = users.id
                ";

            return await connection.QueryAsync<ClientListDTO>(query);
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<ClientDetailsDTO> GetClientById(Guid clientIdInserted)
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            string query = @"
                    SELECT 
	                    clients.id AS clientId,
                        users.user_type_id AS userTypeId,
	                    clients.user_id AS clientUserId,
	                    users.profile_image_url AS clientProfileImage,
	                    users.email AS clientUserEmail,
	                    users.phone_number AS clientUserPhoneNumber,
	                    clients.trade_name AS tradeName,
	                    clients.company_name AS companyName,
	                    clients.cnpj AS cnpj
                    FROM 
	                    clients
                    INNER JOIN users
	                    ON clients.user_id = users.id
                    WHERE 
	                    clients.id = @clientIdInserted
            ";

            return (await connection.QueryFirstOrDefaultAsync<ClientDetailsDTO>(query, new { clientIdInserted }))!;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<BasicClientDTO> GetClientByUserId(Guid userId)
    {
        try
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                string query = @"
                    SELECT
                        C.id AS clientId,
	                    C.trade_name AS tradeName
                    FROM users AS U
                    JOIN clients AS C
	                    ON C.user_id = U.id
                    WHERE U.id = @userId
                ";

                return (await connection.QueryFirstOrDefaultAsync<BasicClientDTO>(query, new { userId }))!;
            }
        }
        catch (Exception)
        {
            throw;
        }
    }
}
