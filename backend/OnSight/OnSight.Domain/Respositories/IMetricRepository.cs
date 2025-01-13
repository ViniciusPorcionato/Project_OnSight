using OnSight.Domain.Entities;

namespace OnSight.Domain.Respositories;
public interface IMetricRepository
{
    Task RegisterMetricCategory(MetricCategory category);
    Task RegisterMetricHistory(MetricHistory history);
}