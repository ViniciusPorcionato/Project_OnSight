namespace OnSight.Infra.Data.DAOs.MetricDAO;

public record MetricDTO(
    decimal value,
    decimal percentualDelta,
    DateTime metricDateTime,
    Guid metricCategoryId
);
