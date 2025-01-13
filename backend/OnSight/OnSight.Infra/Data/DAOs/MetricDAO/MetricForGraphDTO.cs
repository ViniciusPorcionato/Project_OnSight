namespace OnSight.Infra.Data.DAOs.MetricDAO;

public record MetricForGraphDTO(
    decimal value,
    decimal percentualDelta,
    DateTime metricDateTime
);