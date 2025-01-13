using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using OnSight.Domain.Entities;
using OnSight.Infra.Data.DAOs.ClientDAO;
using OnSight.Infra.Data.DAOs.TechnicianDAO;

namespace OnSight.Infra.Data.DAOs.IndividualPersonDAO;

public class TechnicianDAO : ITechnicianDAO
{
    private const double SCORE_ACCURACY = 0.1; // Accuracy de similaridade da pesquisa

    private readonly string _connectionString;

    public TechnicianDAO()
    {
        IConfigurationRoot config = new ConfigurationBuilder()
            .AddUserSecrets<TechnicianDAO>()
            .Build();

        _connectionString = config["ConnectionStrings:AzurePostgresDB"]!;
    }

    public async Task<Guid> GetTechnicianIdByUserId(Guid userId)
    {
        try
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                string query = @"
                    SELECT
                        T.id AS technicianId
                    FROM users AS U
                    JOIN individual_persons AS I
                        ON I.user_id = U.id
                    JOIN technicians AS T
	                    ON T.individual_person_id = I.id
                    WHERE I.user_id = @userId
                ";

                return (await connection.QueryFirstOrDefaultAsync<Guid>(query, new { userId }))!;
            }
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<int> GetTechnicianStatusCodeById(Guid technicianId)
    {
        try
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                string query = @"
                    SELECT
	                    t.technician_status_id
                    FROM technicians AS t
                    WHERE id = @technicianId
                ";

                return (await connection.QueryFirstOrDefaultAsync<int>(query, new { technicianId }))!;
            }
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<IEnumerable<TechnicianSearchDTO>> GetTechniciansWithFilterAndSearch(string textToSearch, int technicianStatusId)
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            string query = @"
                    SELECT 
                        technicians.id AS technicianId,
                        individual_persons.id AS individualPersonId,
                        users.id AS userId,
                        individual_persons.name AS nameTechnician,
                        users.profile_image_url AS photoUrlTechnician,
                        technicians.technician_status_id AS technicianStatusId
                    FROM technicians
                    INNER JOIN individual_persons
                    ON individual_persons.id = technicians.individual_person_id
                    INNER JOIN users
                    ON users.id = individual_persons.user_id
                    WHERE 
                        (
                            @textToSearch IS NULL
                            OR GREATEST(SIMILARITY(individual_persons.name, @textToSearch)) > @scoreAccuracy
                        )
                        AND 
                        (
                            (@technicianStatusId IN (0,1,2,3) AND technicians.technician_status_id = @technicianStatusId)
                            OR @technicianStatusId NOT IN (0,1,2,3)
                        )
                    ORDER BY GREATEST(SIMILARITY(individual_persons.name, @textToSearch)) DESC
            ";

            return await connection.QueryAsync<TechnicianSearchDTO>(query, new { scoreAccuracy = SCORE_ACCURACY, textToSearch, technicianStatusId });
        }
        catch (Exception)
        {
            throw;
        }
    }
}
