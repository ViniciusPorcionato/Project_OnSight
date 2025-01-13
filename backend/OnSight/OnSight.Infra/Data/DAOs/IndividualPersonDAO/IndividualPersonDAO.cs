using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using OnSight.Domain.Entities;
using OnSight.Infra.Data.DAOs.IndividualPerson;
using OnSight.Infra.Data.DAOs.ServiceCallDAO.DTOs;

namespace OnSight.Infra.Data.DAOs.IndividualPersonDAO;

public class IndividualPersonDAO : IIndividualPersonDAO
{
    private readonly string _connectionString;

    public IndividualPersonDAO()
    {
        IConfigurationRoot config = new ConfigurationBuilder()
            .AddUserSecrets<IndividualPersonDAO>()
            .Build();

        _connectionString = config["ConnectionStrings:AzurePostgresDB"]!;
    }

    public async Task<IEnumerable<IndividualPersonListDTO>> GetIndividualPersonsByType(int userTypeId)
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            string query = @"
                    SELECT
	                    individual_persons.id AS individualPersonId,
	                    individual_persons.user_id AS userId,
	                    users.user_type_id AS userTypeId,
	                    users.profile_image_url AS profileImageUrl,
	                    individual_persons.name AS userName,
	                    users.email AS email,
	                    users.phone_number AS phoneNumber
                    FROM
	                    individual_persons
                    INNER JOIN 
                        users
                    ON 
	                    users.id = individual_persons.user_id
                    WHERE 
                        users.user_type_id = @userTypeId
            ";

            return (await connection.QueryAsync<IndividualPersonListDTO>(query, new { userTypeId }))!;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<IndividualPersonDetailsDTO> GetIndividualPersonById(Guid idIndividualPerson)
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            string query = @"
                    SELECT
	                    individual_persons.id AS idIndividualPerson,
	                    individual_persons.user_id AS userId,
	                    users.user_type_id AS userTypeId,
	                    users.profile_image_url AS profileImageUrl,
	                    users.email AS email,
	                    users.phone_number AS phoneNumber,
	                    individual_persons.name AS userName,
	                    individual_persons.cpf AS cpf,
	                    individual_persons.rg AS rg,
	                    individual_persons.birth_date AS birthDate
                    FROM
	                    individual_persons
                    INNER JOIN users
                    ON 
	                    users.id = individual_persons.user_id
                    WHERE
                        individual_persons.id = @idIndividualPerson
            ";

            var response = (await connection.QueryFirstOrDefaultAsync<IndividualPersonDetailsDTO>(query, new { idIndividualPerson = idIndividualPerson }))!;

            return response;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<BasicIndividualPersonDTO> GetIndividualPersonByUserId(Guid userId)
    {
        try
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                string query = @"
                    SELECT
                        I.id AS individualPersonId,
	                    I.name AS userName
                    FROM users AS U
                    JOIN individual_persons AS I
	                    ON I.user_id = U.id
                    WHERE U.id = @userId
                ";

                return (await connection.QueryFirstOrDefaultAsync<BasicIndividualPersonDTO>(query, new { userId }))!;
            }
        }
        catch (Exception)
        {
            throw;
        }
    }
    public async Task<CurrentServiceCallDTO> GetServiceCallIdByTechnicianId(Guid technicianId)
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            string query = @"
                    SELECT
	                    service_calls.id AS serviceCallId,
	                    technicians.technician_status_id AS technicianStatus
                    FROM service_calls
                    INNER JOIN technicians
                    ON technicians.id = @technicianId
                    WHERE service_calls.technician_id = @technicianId
                    AND service_calls.call_status_id = 1
            ";

            return (await connection.QueryFirstOrDefaultAsync<CurrentServiceCallDTO>(query, new { technicianId }))!;
        }
        catch (Exception)
        {
            throw;
        }
    }
}
