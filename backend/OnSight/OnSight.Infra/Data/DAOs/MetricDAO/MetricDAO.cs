using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace OnSight.Infra.Data.DAOs.MetricDAO;

public class MetricDAO : IMetricDAO
{
    private readonly string _connectionString;

    public MetricDAO()
    {
        IConfigurationRoot config = new ConfigurationBuilder()
            .AddUserSecrets<MetricDAO>()
            .Build();

        _connectionString = config["ConnectionStrings:AzurePostgresDB"]!;
    }

    public async Task<MetricDTO> GetLastMetricRegisteredByCategory(Guid metricCategoryId)
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            string query = @"
                SELECT
                    value,
                    percentual_delta AS percentualDelta,
                    metric_date_time AS metricDateTime,
                    metric_category_id AS metricCategoryId
                FROM metric_histories
                WHERE metric_category_id = @categoryId
                ORDER BY metric_date_time DESC
            ";

            return (await connection.QueryFirstOrDefaultAsync<MetricDTO>(query, new { categoryId = metricCategoryId }))!;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<IEnumerable<MetricForGraphDTO>> GetMetricsGraphDataByCategory(Guid metricCategoryId)
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            string query = @"
                SELECT
                    value,
                    percentual_delta AS percentualDelta,
                    metric_date_time AS metricDateTime
                FROM metric_histories
                WHERE metric_category_id = @categoryId
                ORDER BY metric_date_time ASC
                LIMIT 30
            ";

            return (await connection.QueryAsync<MetricForGraphDTO>(query, new { categoryId = metricCategoryId }))!;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task<IEnumerable<MostRecentMetricDTO>> ListMostRecentMetrics()
    {
        try
        {
            using var connection = new NpgsqlConnection(_connectionString);
            string query = @"
                SELECT DISTINCT ON (C.id)
		            H.value AS value, 
		            H.percentual_delta AS percentualDelta,
		            H.metric_date_time AS metricDateTime,
		            C.name AS metricCategoryName,
                    C.id AS metricCategoryId,
                    C.metric_description AS metricDescription,
                    C.metric_unit AS metricUnit
	            FROM metric_histories AS H
	            JOIN metrics_categories AS C
		            ON H.metric_category_id = C.id
	            ORDER BY C.id, H.metric_date_time DESC
            ";

            return (await connection.QueryAsync<MostRecentMetricDTO>(query))!;
        }
        catch (Exception)
        {
            throw;
        }
    }
}
