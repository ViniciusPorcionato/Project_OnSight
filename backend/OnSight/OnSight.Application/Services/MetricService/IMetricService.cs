using OnSight.Application.Services.Contracts.Requests;
using OnSight.Infra.Data.DAOs.MetricDAO;

namespace OnSight.Application.Services.MetricService;

public interface IMetricService
{
    Task RegisterMetricCategory(RegisterMetricCategoryRequest request);
    Task<IEnumerable<MostRecentMetricDTO>> ListMostRecentMetrics();
    Task<IEnumerable<MetricForGraphDTO>> ListMetricGraphDataByCategory(Guid categoryId);
}
