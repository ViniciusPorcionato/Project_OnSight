using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using OnSight.Infra.Data.DAOs.ServiceCallDAO.DTOs;

namespace OnSight.Infra.Data.DAOs.ServiceCallDAO;

public class ServiceCallDAO : IServiceCallDAO
{
    private const double SCORE_ACCURACY = 0.1; // Accuracy de similaridade da pesquisa

    private readonly string _connectionString;

    public ServiceCallDAO()
    {
        IConfigurationRoot config = new ConfigurationBuilder()
            .AddUserSecrets<ServiceCallDAO>()
            .Build();

        _connectionString = config["ConnectionStrings:AzurePostgresDB"]!;
    }


    public async Task<IEnumerable<OpenedServiceCallDTO>> GetOpenedServiceCalls()
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            string query = @"
                    SELECT
	                    service_calls.id AS idServiceCall,
	                    service_calls.client_id AS clientId,
                        users.profile_image_url AS clientPhotoUrl,
	                    clients.trade_name AS tradeName,
	                    service_calls.service_type_id AS serviceCallTypeId,
                        service_calls.call_status_id AS serviceCallStatusId,
	                    service_calls.creation_date_time AS serviceCallCreationDateTime
                    FROM
	                    service_calls
                    INNER JOIN clients
                        ON service_calls.client_id = clients.id
                    INNER JOIN users
                        ON users.id = clients.user_id
                    WHERE service_calls.call_status_id = 0
            ";

            return (await connection.QueryAsync<OpenedServiceCallDTO>(query))!;
        }
        catch (Exception)
        {
            throw;
        }
    }
    public async Task<IEnumerable<CallHistoryDTO>> GetTechnicianCallHistory(Guid technicianId)
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            string query = @"
                    SELECT
	                    service_calls.id AS idServiceCall,
	                    service_calls.call_status_id AS callStatusId,
	                    service_calls.creation_date_time AS creationDateTime,
	                    service_calls.description AS callDescription,
	                    service_calls.service_type_id AS callServiceTypeId,
	                    service_calls.urgency_status_id AS callUrgencyStatusId,
	                    clients.id AS clientId,
	                    clients.trade_name AS tradeName,
	                    users.profile_image_url AS profileImageUrl
                    FROM
	                    service_calls
                    INNER JOIN clients
                    ON clients.id = service_calls.client_id
                    INNER JOIN users
                    ON users.id = clients.user_id
                    WHERE 
	                    service_calls.technician_id = @technicianId
                    AND
	                    service_calls.call_status_id = 2
            ";

            return (await connection.QueryAsync<CallHistoryDTO>(query, new { technicianId }))!;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<ServiceCallDetailsDTO> GetServiceCallDetailsById(Guid serviceCallId)
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            string query = @"
                    SELECT
	                    service_calls.id AS serviceCallId,
	                    service_calls.client_id AS clientId,
	                    clients.user_id AS userId,
                        service_calls.call_status_id AS callStatusId,
	                    service_calls.call_code AS callCode,
	                    service_calls.creation_date_time AS creationDateTime,
	                    service_calls.service_type_id AS serviceTypeId,
	                    users.phone_number AS phoneNumberClient,
	                    users.email AS emailClient,
                        addresses.cep AS addressCep,
                        addresses.number AS addressNumber,
                        addresses.complement AS addressComplement,
	                    service_calls.is_recurring_call AS isRecurring,
	                    service_calls.conclusion_date_time AS conclusionDateTime,
	                    service_calls.description AS description,
	                    service_calls.urgency_status_id AS urgencyStatusId,
                        clients.trade_name AS clientTradeName,
	                    users.profile_image_url AS clientPhotoImgUrl,
                        individual_persons.name AS responsibleAttendantName,
                        service_calls.deadline AS deadLine
                    FROM service_calls
                    JOIN clients
	                    ON service_calls.client_id = clients.id
                    JOIN users
	                    ON clients.user_id = users.id
                    JOIN addresses
	                    ON service_calls.address_id = addresses.id
                    LEFT JOIN individual_persons
                        ON individual_persons.id = service_calls.responsible_attendant_id
                    WHERE service_calls.id = @serviceCallId;
            ";

            return (await connection.QueryFirstOrDefaultAsync<ServiceCallDetailsDTO>(query, new { serviceCallId }))!;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<ServiceCallDetailsDTO> GetOpenedCallDetailsById(Guid serviceCallId)
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            string query = @"
                    SELECT
	                    service_calls.id AS serviceCallId,
	                    service_calls.client_id AS clientId,
	                    clients.user_id AS userId,
                        service_calls.call_status_id AS callStatusId,
	                    service_calls.call_code AS callCode,
	                    service_calls.creation_date_time AS creationDateTime,
	                    service_calls.service_type_id AS serviceTypeId,
	                    users.phone_number AS phoneNumberClient,
	                    users.email AS emailClient,
	                    service_calls.address_id AS addressIdClient,
                        addresses.cep AS addressCep,
	                    service_calls.is_recurring_call AS isRecurring,
	                    service_calls.conclusion_date_time AS conclusionDateTime,
	                    service_calls.description AS description,
	                    service_calls.urgency_status_id AS urgencyStatusId,
                        clients.trade_name AS clientTradeName,
	                    users.profile_image_url AS clientPhotoImgUrl
                    FROM service_calls
                    INNER JOIN clients
	                    ON service_calls.client_id = clients.id
                    INNER JOIN users
	                    ON clients.user_id = users.id
                    INNER JOIN addresses
	                    ON service_calls.address_id = addresses.id
                    WHERE
	                    service_calls.id = @serviceCallId;
            ";

            return (await connection.QueryFirstOrDefaultAsync<ServiceCallDetailsDTO>(query, new { serviceCallId }))!;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<ushort> CountServiceCallsOpenedByDate(DateTime dateTime)
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            string query = @"
                SELECT
                    COUNT(id)
                FROM service_calls
                WHERE DATE(creation_date_time) = @date
            ";

            return (await connection.QueryFirstOrDefaultAsync<ushort>(query, new { date = dateTime.Date }))!;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<IEnumerable<OpenedServiceCallDTO>> GetFilteredOpenedCallsListSearchAndFilter(string textToSearch, int serviceTypeId)
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            string query = @"
                    SELECT 
	                    service_calls.id AS idServiceCall,
	                    clients.id AS clientId,
                        users.profile_image_url AS clientPhotoUrl,
                        clients.trade_name AS tradeName,
	                    service_calls.service_type_id AS serviceCallTypeId,
                        service_calls.call_status_id AS serviceCallStatusId,
	                    service_calls.creation_date_time AS serviceCallCreationDateTime
                    FROM clients
                    INNER JOIN service_calls
                        ON service_calls.client_id = clients.id
                    INNER JOIN users
                        ON users.id = clients.user_id
                    WHERE 
	                    (
                            @textToSearch IS NULL
                            OR GREATEST(SIMILARITY(clients.trade_name, @textToSearch)) > @scoreAccuracy
                        )
	                    AND 
                        (
                            (@serviceTypeId IN (0,1) AND service_calls.service_type_id = @serviceTypeId)
	                        OR @serviceTypeId NOT IN (0, 1)
                        )
                        AND service_calls.call_status_id = 0
                    ORDER BY GREATEST(SIMILARITY(clients.trade_name, @textToSearch)) DESC
            ";

            return (await connection.QueryAsync<OpenedServiceCallDTO>(query, new { scoreAccuracy = SCORE_ACCURACY, textToSearch, serviceTypeId }))!;

        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<IEnumerable<ServiceCallDTO>> GetCallsSearchAndFilter(string textToSearch, int callStatusId)
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            string query = @"
                    SELECT
                        service_calls.id AS serviceCallId,
                        clients.id AS clientId,
                        users.profile_image_url AS clientPhotoUrl,
                        clients.trade_name AS clientTradeName,
                        service_calls.service_type_id AS callTypeId,
	                    service_calls.call_status_id AS callStatusId
                    FROM service_calls
                    INNER JOIN clients
                    ON clients.id = service_calls.client_id
                    INNER JOIN users
                    ON users.id = clients.user_id

                    WHERE 
                        (
                            @textToSearch IS NULL
                            OR GREATEST(SIMILARITY(clients.trade_name, @textToSearch)) > @scoreAccuracy
                        )
                        AND 
                        (
                            (@callStatusId IN (0, 1, 2, 3) AND service_calls.call_status_id = @callStatusId)
                            OR @callStatusId NOT IN (0, 1, 2, 3)
                        )
                    ORDER BY GREATEST(SIMILARITY(clients.trade_name, @textToSearch)) DESC
            ";

            return (await connection.QueryAsync<ServiceCallDTO>(query, new { scoreAccuracy = SCORE_ACCURACY, textToSearch, callStatusId }))!;

        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<decimal> CountAvarageTimePerServiceCall(DateTime dateTime)
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            string query = @"
                SELECT 
                    COALESCE(AVG(
                        EXTRACT(
                            EPOCH FROM (conclusion_date_time - creation_date_time)
                        )
                    ) / 3600, 0) AS avg_resolution_hours
                FROM service_calls
                WHERE DATE(conclusion_date_time) = @date
            ";

            return (await connection.QueryFirstOrDefaultAsync<decimal>(query, new { date = dateTime.Date }))!;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<decimal> CountAvarageTravelTimePerServiceCall(DateTime dateTime)
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            string query = @"
                SELECT 
                    COALESCE(AVG(
                        EXTRACT(
                            EPOCH FROM (arrival_date_time - attribution_date_time)
                        )
                    ) / 3600, 0) AS avg_resolution_hours
                FROM service_calls
                WHERE DATE(conclusion_date_time) = @date
            ";

            return (await connection.QueryFirstOrDefaultAsync<decimal>(query, new { date = dateTime.Date }))!;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<decimal> CountRecurringServiceCallRate(DateTime dateTime)
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            string query = @"
                WITH daily_calls AS (
                    SELECT
                        COUNT(id) as total_calls,
                        COUNT(CASE WHEN is_recurring_call = true THEN 1 END) as recurring_calls
                    FROM service_calls
                    WHERE DATE(conclusion_date_time) = @date
                )
                SELECT 
                    CASE 
                        WHEN total_calls = 0 THEN 0
                        ELSE recurring_calls::DECIMAL / total_calls
                    END AS recurring_rate_percentage
                FROM daily_calls;
            ";

            return (await connection.QueryFirstOrDefaultAsync<decimal>(query, new { date = dateTime.Date }))!;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<CallForMapViewDTO> GetServiceCallByTechniciaId(Guid technicianId)
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            string query = @"
                SELECT
                     service_calls.id AS serviceCallId,
                     clients.trade_name AS clientTradeName,
                     users.profile_image_url AS clientProfileImageUrl,
                     addresses.latitude AS latitude,
                     addresses.longitude AS longitude,
                     service_calls.technician_id AS technicianId
                 FROM service_calls
                 JOIN clients
                     ON clients.id = service_calls.client_id
                 JOIN users
                     ON users.id = clients.user_id
                 JOIN addresses
                     ON addresses.id = service_calls.address_id
                 WHERE service_calls.technician_id = @technicianId AND service_calls.call_status_id = 1
            ";

            return (await connection.QueryFirstOrDefaultAsync<CallForMapViewDTO>(query, new { technicianId }))!;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<IEnumerable<CallForMapViewDTO>> GetAllServiceCallsInProgress()
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            string query = @"
                SELECT
                     service_calls.id AS serviceCallId,
                     clients.trade_name AS clientTradeName,
                     users.profile_image_url AS clientProfileImageUrl,
                     addresses.latitude AS latitude,
                     addresses.longitude AS longitude,
                     service_calls.technician_id AS technicianId
                 FROM service_calls
                 JOIN clients
                     ON clients.id = service_calls.client_id
                 JOIN users
                     ON users.id = clients.user_id
                 JOIN addresses
                     ON addresses.id = service_calls.address_id
                 WHERE service_calls.call_status_id = 1
            ";

            return (await connection.QueryAsync<CallForMapViewDTO>(query))!;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<CallForMapViewDTO> GetServiceCallForMapById(Guid serviceCallId)
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            string query = @"
                SELECT
                     service_calls.id AS serviceCallId,
                     clients.trade_name AS clientTradeName,
                     users.profile_image_url AS clientProfileImageUrl,
                     addresses.latitude AS latitude,
                     addresses.longitude AS longitude,
                     service_calls.technician_id AS technicianId
                 FROM service_calls
                 JOIN clients
                     ON clients.id = service_calls.client_id
                 JOIN users
                     ON users.id = clients.user_id
                 JOIN addresses
                     ON addresses.id = service_calls.address_id
                 WHERE service_calls.id = @serviceCallId
            ";

            return (await connection.QueryFirstOrDefaultAsync<CallForMapViewDTO>(query, new { serviceCallId }))!;
        }
        catch (Exception)
        {
            throw;
        }
    }
}
