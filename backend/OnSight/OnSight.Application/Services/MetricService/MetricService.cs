using OnSight.Application.Services.Contracts.Requests;
using OnSight.Domain.Entities;
using OnSight.Domain.Respositories;
using OnSight.Infra.Data.DAOs.MetricDAO;
using OnSight.Infra.Data.UnityOfWork;

namespace OnSight.Application.Services.MetricService;

public class MetricService : IMetricService
{
    private readonly IMetricRepository _metricRepository;

    private readonly IMetricDAO _metricDAO;

    private readonly IUnityOfWork _unityOfWork;

    public MetricService(IMetricRepository metricRepository, IMetricDAO metricDAO, IUnityOfWork unityOfWork)
    {
        _metricRepository = metricRepository;

        _metricDAO = metricDAO;

        _unityOfWork = unityOfWork;
    }

    public async Task<IEnumerable<MetricForGraphDTO>> ListMetricGraphDataByCategory(Guid categoryId)
    {
        try
        {
            return await _metricDAO.GetMetricsGraphDataByCategory(categoryId);
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
            return await _metricDAO.ListMostRecentMetrics();
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task RegisterMetricCategory(RegisterMetricCategoryRequest request)
    {
        try
        {
            var metricCategory = new MetricCategory(
                name: request.metricName,
                metricDescription: request.metricDescription,
                metricUnit: request.metricUnit
            );

            await _metricRepository.RegisterMetricCategory(metricCategory);

            await _unityOfWork.Commit();
        }
        catch(Exception) 
        {
            throw;
        }
    }
}
