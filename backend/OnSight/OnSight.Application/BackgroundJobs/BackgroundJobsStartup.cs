using System.Linq.Expressions;
using Hangfire;

namespace OnSight.Application.BackgroundJobs
{
    public class BackgroundJobsStartup
    {
        private readonly KeyPerformanceIndicatorRegistrationJob _kpiRegistrationJob;

        public BackgroundJobsStartup(KeyPerformanceIndicatorRegistrationJob kpiRegistrationJob)
        {
            _kpiRegistrationJob = kpiRegistrationJob;
        }

        public void RegisterAllBackgroundJobs()
        {
            RecurringJob.AddOrUpdate("register_diary_kpis", () => _kpiRegistrationJob.RegisterAllKPIs(), Cron.Hourly());
        }

        public void ScheduleBackgroundJob(Expression<Action> callback, TimeSpan timeToExecute)
        {
            BackgroundJob.Schedule(
                methodCall: callback,
                delay: timeToExecute
            );
        }

        public void AddBackgroundJob(Expression<Action> callback)
        {
            BackgroundJob.Enqueue(callback);
        }
    }
}
