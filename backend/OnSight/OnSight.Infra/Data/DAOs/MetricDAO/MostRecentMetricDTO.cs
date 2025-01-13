namespace OnSight.Infra.Data.DAOs.MetricDAO;

public record MostRecentMetricDTO(
    decimal value,
    decimal percentualDelta,
    DateTime metricDateTime,
    string metricCategoryName,
    Guid metricCategoryId,
    string metricDescription,
    string metricUnit
);
