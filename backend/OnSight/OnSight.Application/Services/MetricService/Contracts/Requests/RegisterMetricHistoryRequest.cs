using OnSight.Domain.Entities;

namespace OnSight.Application.Services.Contracts.Requests;

public record RegisterMetricHistoryRequest
(
    Guid metricCategoryId,
    decimal value
);
