namespace OnSight.Application.Services.Contracts.Requests;

public record RegisterMetricCategoryRequest
(
    string metricName,
    string metricDescription,
    string metricUnit
);
