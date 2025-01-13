using OnSight.Application.Services;
using OnSight.Infra.Data;
using OnSight.Utils.Cryptography;
using OnSight.Utils.Token;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using OnSight.Domain.Respositories;
using OnSight.Infra.Data.UnityOfWork;
using OnSight.Infra.Data.DAOs.UserDAO;
using OnSight.Infra.Data.DAOs.ClientDAO;
using OnSight.Infra.Data.DAOs.IndividualPersonDAO;
using OnSight.Infra.Data.Repositories;
using OnSight.Application.Services.ServiceCallService;
using OnSight.Infra.CloudStorage;
using OnSight.Infra.Data.DAOs.ServiceCallDAO;
using OnSight.Application.Services.MetricService;
using Hangfire;
using OnSight.Application.BackgroundJobs;
using OnSight.Infra.Data.DAOs.MetricDAO;
using OnSight.Application.Services.CallAssignmentManagerService;
using OnSight.Infra.Geolocation;
using OnSight.Application.RealTime.Hubs;
using Microsoft.AspNetCore.SignalR;
using OnSight.Application.RealTime;
using OnSight.Application.RealTime.Interfaces;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);
{
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowOrigin",
            builder =>
            {
                builder.WithOrigins("http://192.168.15.144:5288", "http://172.16.39.117:5288", "http://172.28.192.1:3000") // URL do APP Client
                       .AllowAnyMethod()
                       .AllowAnyHeader()
                       .AllowCredentials()
                       .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                       .SetIsOriginAllowed(_ => true);
            });
    });

    string databaseConnectionString = builder.Configuration["ConnectionStrings:AzurePostgresDB"]!;
    BackgroundJobsConfiguration.ConfigureHangfireServices(builder.Services, databaseConnectionString);

    // Adding DbContext
    builder.Services.AddDbContext<DataContext>();

    // Repositories
    builder.Services.AddScoped<IUserRepository, UserRepository>();
    builder.Services.AddScoped<IServiceCallRepository, ServiceCallRepository>();
    builder.Services.AddScoped<IMetricRepository, MetricRepository>();

    // UnityOfWork
    builder.Services.AddScoped<IUnityOfWork, UnityOfWork>();

    // DAOs
    builder.Services.AddScoped<IUserDAO, UserDAO>();
    builder.Services.AddScoped<IIndividualPersonDAO, IndividualPersonDAO>();
    builder.Services.AddScoped<ITechnicianDAO, TechnicianDAO>();
    builder.Services.AddScoped<IClientDAO, ClientDAO>();
    builder.Services.AddScoped<IServiceCallDAO, ServiceCallDAO>();
    builder.Services.AddScoped<IMetricDAO, MetricDAO>();

    // Cloud Storage
    builder.Services.AddSingleton<ICloudStorage, AzureBlobStorage>();

    // Geolocation
    builder.Services.AddHttpClient<GoogleMapsProvider>();
    builder.Services.AddScoped<IGeolocationProvider, GoogleMapsProvider>();

    builder.Services.AddHttpClient<ViaCepProvider>();
    builder.Services.AddScoped<ICepInterpreterProvider, ViaCepProvider>();

    // Strategies Injections
    builder.Services.AddSingleton<ICryptographyStrategy, CryptographyStrategy>();
    builder.Services.AddSingleton<ITokenStrategy, TokenStrategy>();

    // Background Jobs Configuration
    builder.Services.AddSingleton<BackgroundJobsConfiguration>();
    builder.Services.AddSingleton<KeyPerformanceIndicatorRegistrationJob>();
    builder.Services.AddSingleton<BackgroundJobsStartup>();

    // RealTime - SignalR
    builder.Services.AddSignalR(options =>
    {
        // Setta o intervalo de inatividade do Cliente para encerrar a conexão automaticamente
        options.ClientTimeoutInterval = TimeSpan.FromSeconds(45);
    });
    builder.Services.AddSingleton<IUserIdProvider, CustomUserIdProvider>();
    builder.Services.AddSingleton<IActiveUserService, ActiveUserService>();

    // Services
    builder.Services.AddScoped<ICallAssignmentManagerService, CallAssignmentManagerService>();
    builder.Services.AddScoped<IServiceCallService, ServiceCallService>();
    builder.Services.AddScoped<IUserService, UserService>();
    builder.Services.AddScoped<IMetricService, MetricService>();


    // JWT Configuration
    var key = Encoding.ASCII.GetBytes(builder.Configuration["Token:SecurityKey"]!);

    builder.Services
    .AddAuthorization(x =>
    {
        x.AddPolicy("IsTechnician", policy
            => policy.RequireAssertion(context
                => context.User.HasClaim(claim => claim.Type == ClaimTypes.Role && claim.Value == "2")
            )
        );

        x.AddPolicy("IsInternalUser", policy
            => policy.RequireAssertion(context
                => context.User.HasClaim(claim => claim.Type == ClaimTypes.Role && (claim.Value == "0" || claim.Value == "1"))
            )
        );
    })
    .AddAuthentication(x =>
    {
        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(x =>
    {
        x.RequireHttpsMetadata = false;
        x.SaveToken = true;
        x.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false
        };
        x.Authority = "Authority URL";
        x.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];

                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) &&
                    (path.StartsWithSegments("/communicationHub")))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });
}

var app = builder.Build();
{

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();

        app.UseHangfireDashboard();
    }

    using (var scope = app.Services.CreateScope())
    {
        var backgroundJobsStartup = scope.ServiceProvider.GetRequiredService<BackgroundJobsStartup>();
        backgroundJobsStartup.RegisterAllBackgroundJobs();
    }

    app.UseHttpsRedirection();

    app.UseAuthorization();

    app.MapControllers();
    app.MapHangfireDashboard();
    app.MapHub<CommunicationHub>("/communicationHub");

    app.UseCors("AllowOrigin");

    app.Run();
}
