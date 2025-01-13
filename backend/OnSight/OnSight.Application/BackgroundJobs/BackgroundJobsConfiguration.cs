using Hangfire;
using Hangfire.PostgreSql;

namespace OnSight.Application.BackgroundJobs
{
    public class BackgroundJobsConfiguration
    {
        public static void ConfigureHangfireServices(IServiceCollection services, string connectionString)
        {
            services.AddHangfire(configuration => configuration
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UsePostgreSqlStorage(postgres => postgres
                    .UseNpgsqlConnection(connectionString)));

            services.AddHangfireServer();
        }
    }
}
