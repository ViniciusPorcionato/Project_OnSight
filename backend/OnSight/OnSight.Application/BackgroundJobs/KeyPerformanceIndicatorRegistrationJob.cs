using OnSight.Domain.Entities;
using OnSight.Domain.Respositories;
using OnSight.Infra.Data;
using OnSight.Infra.Data.DAOs.MetricDAO;
using OnSight.Infra.Data.DAOs.ServiceCallDAO;
using OnSight.Infra.Data.Repositories;
using OnSight.Infra.Data.UnityOfWork;

namespace OnSight.Application.BackgroundJobs;

public class KeyPerformanceIndicatorRegistrationJob
{
    private readonly IMetricRepository _metricRepository;

    private readonly IMetricDAO _metricDAO;
    private readonly IServiceCallDAO _serviceCallDAO;

    private readonly IUnityOfWork _unityOfWork;

    private Guid CallsPerDayCategoryId = Guid.Parse("b535671a-cc7f-4cbd-9ab6-1de4d6aadae6");
    private Guid AvarageTimeByServiceCallCategoryId = Guid.Parse("95ac4c41-e7da-4929-9ec9-0ac708458084");
    private Guid AvarageTravelTimeCallCategoryId = Guid.Parse("145b264e-1dd9-4d3d-a671-b3280164a2be");
    private Guid RecurringServiceCallRateCategoryId = Guid.Parse("fd10322f-0dc1-4a27-9155-2c4a7bb92c5e");

    public KeyPerformanceIndicatorRegistrationJob()
    {
        var context = new DataContext();

        _metricRepository = new MetricRepository(context);

        _metricDAO = new MetricDAO();
        _serviceCallDAO = new ServiceCallDAO();

        _unityOfWork = new UnityOfWork(context);
    }

    public async Task RegisterAllKPIs()
    {
        await RegisterCallsPerDay();
        await RegisterAvarageTimeByServiceCall();
        await RegisterAvarageTravelTime();
        await RegisterRecurringServiceCallRate();
    }

    private async Task<decimal> CalculatePercentualDelta(decimal currentValue, Guid metricCategoryId)
    {
        var lastMetricRegistration = await _metricDAO.GetLastMetricRegisteredByCategory(CallsPerDayCategoryId);

        if (lastMetricRegistration == null)
            return 0;

        decimal previousValue = lastMetricRegistration.value;

        if (previousValue == 0)
            return 0;

        decimal deltaBetweenValues = currentValue - previousValue;
        decimal percentualDelta = deltaBetweenValues / previousValue;

        return percentualDelta;
    }

    private async Task RegisterNewMetricHistory(Guid metricCategoryId, decimal value, decimal percentualDelta)
    {
        var metricHistory = new MetricHistory(
            metricCategoryId: metricCategoryId,
            value: value,
            percentualDelta: percentualDelta
        );

        await _metricRepository.RegisterMetricHistory(metricHistory);
        await _unityOfWork.Commit();
    }

    private async Task RegisterCallsPerDay()
    {
        decimal callsPerDayValue = await _serviceCallDAO.CountServiceCallsOpenedByDate(DateTime.UtcNow);
        decimal percentualDelta = await CalculatePercentualDelta(callsPerDayValue, CallsPerDayCategoryId);

        await RegisterNewMetricHistory(CallsPerDayCategoryId, callsPerDayValue, percentualDelta);
    }

    private async Task RegisterAvarageTimeByServiceCall()
    {
        decimal avarageTimeByService = await _serviceCallDAO.CountAvarageTimePerServiceCall(DateTime.UtcNow);
        decimal percentualDelta = await CalculatePercentualDelta(avarageTimeByService, AvarageTimeByServiceCallCategoryId);

        await RegisterNewMetricHistory(AvarageTimeByServiceCallCategoryId, avarageTimeByService, percentualDelta);
    }

    private async Task RegisterAvarageTravelTime()
    {
        decimal avarageTravelTimeByService = await _serviceCallDAO.CountAvarageTravelTimePerServiceCall(DateTime.UtcNow);
        decimal percentualDelta = await CalculatePercentualDelta(avarageTravelTimeByService, AvarageTravelTimeCallCategoryId);

        await RegisterNewMetricHistory(AvarageTravelTimeCallCategoryId, avarageTravelTimeByService, percentualDelta);
    }

    private async Task RegisterRecurringServiceCallRate()
    {
        decimal recurringServiceCallRate = await _serviceCallDAO.CountRecurringServiceCallRate(DateTime.UtcNow);
        decimal percentualDelta = await CalculatePercentualDelta(recurringServiceCallRate, RecurringServiceCallRateCategoryId);

        await RegisterNewMetricHistory(RecurringServiceCallRateCategoryId, recurringServiceCallRate, percentualDelta);
    }
}
