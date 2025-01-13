namespace OnSight.Infra.Data.DAOs.MetricDAO;

public interface IMetricDAO
{
    Task<MetricDTO> GetLastMetricRegisteredByCategory(Guid metricCategoryId);
    Task<IEnumerable<MostRecentMetricDTO> > ListMostRecentMetrics();
    Task<IEnumerable<MetricForGraphDTO>> GetMetricsGraphDataByCategory(Guid metricCategoryId);
}
