using OnSight.Domain.Entities;
using OnSight.Domain.Respositories;

namespace OnSight.Infra.Data.Repositories;

public class MetricRepository : IMetricRepository
{
    private readonly DataContext _context;

    public MetricRepository(DataContext context)
    {
        _context = context;
    }

    public async Task RegisterMetricCategory(MetricCategory category)
    {
        await _context.MetricCategories!.AddAsync(category);
    }

    public async Task RegisterMetricHistory(MetricHistory history)
    {
        await _context.MetricHistories!.AddAsync(history);
    }
}
