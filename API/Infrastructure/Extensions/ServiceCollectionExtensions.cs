using Domain.Interfaces;
using Domain.Repositories;
using Infrastructure.Authorization.Services;
using Infrastructure.Background;
using Infrastructure.Configurations;
using Infrastructure.Persistence;
using Infrastructure.Repositories;
using Infrastructure.Seeders;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.SemanticKernel;
using Minio;

namespace Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        var ConnectionString = config.GetConnectionString("HopitalManagementDB");
        services.AddDbContext<AppDbContext>(options => options.UseSqlServer(ConnectionString));

        // setting minio
        var minioSettings = config.GetSection("MinIO").Get<FileStorageSettings>()
            ?? throw new Exception("MinIO settings are missing in appsettings.json");
        // register MinioClient is Singleton (Injectable)
        services.AddSingleton(sp =>
        {
            return new MinioClient()
                .WithEndpoint(minioSettings.Endpoint)
                .WithCredentials(minioSettings.AccessKey, minioSettings.SecretKey)
                // .WithSSL() 
                .Build();
        });

        // configure settings
        services.Configure<FileStorageSettings>(config.GetSection("MinIO"));

        // SETUP GEMINI - SEMANTIC KERNEL
        var geminiSettings = config.GetSection("Gemini").Get<GeminiSettings>()
            ?? throw new Exception("Gemini settings are missing in appsettings.json");

        // KIỂM TRA NHANH:
        Console.WriteLine($"[DEBUG] Gemini Model: '{geminiSettings.Model}'");
        Console.WriteLine($"[DEBUG] Gemini API Key length: {geminiSettings.ApiKey?.Length}");

        services.AddKernel()
                .AddGoogleAIGeminiChatCompletion(
                    modelId: string.IsNullOrWhiteSpace(geminiSettings.Model) ? "gemini-1.5-pro" : geminiSettings.Model,
                    apiKey: geminiSettings.ApiKey!);

        // Add SignalR
        services.AddSignalR(options =>
        {
            options.EnableDetailedErrors = true;
        }).AddJsonProtocol(options =>
        {
            options.PayloadSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        });

        // Add Authentication Services
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.Authority = config["Auth0:Authority"];
            options.Audience = config["Auth0:Audience"];

            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var accessToken = context.Request.Query["access_token"];

                    // If the request is for our hub...
                    var path = context.HttpContext.Request.Path;
                    if (!string.IsNullOrEmpty(accessToken) &&
                        path.Value!.StartsWith("/hubs/notifications", StringComparison.OrdinalIgnoreCase))
                    {
                        // Read the token out of the query string
                        context.Token = accessToken;
                    }
                    return Task.CompletedTask;
                }
            };
        });


        // add repositories scoped
        services.AddScoped<IPatientsRepository, PatientsRepository>();
        services.AddScoped<IUserRepository, UsersRepository>();
        services.AddScoped<IEthnicityRepository, EthnicityRepository>();
        services.AddScoped<IMedicalRecordsRepository, MedicalRecordsRepository>();
        services.AddScoped<IMedicalAttachmentRepository, MedicalAttachmentRepository>();
        services.AddScoped<IXRayRepository, XRayRepository>();
        services.AddScoped<IHematologyRepository, HematologyRepository>();
        services.AddScoped<IUserRoleRepository, UserRolesRepository>();
        services.AddScoped<IDepartmentRepository, DepartmentRepository>();
        services.AddScoped<INotificationRepository, NotificationRepository>();
        services.AddScoped<IUserNotificationRepository, UserNotificationRepository>();

        // add seeders scoped
        services.AddScoped<ISeeder, Seeder>();

        // add services
        services.AddSingleton<IFileStorageService, FileStorageService>();
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
        services.AddScoped<IGenerateIdService, GenerateIdService>();
        services.AddScoped<IPdfProcessorService, PdfProcessorService>();
        services.AddHttpClient<IGeminiClientService, GeminiClientService>();
        services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<INotificationEmailJobService, NotificationEmailJobService>();

        // add authorization
        services.AddScoped<IUserAuthorizationService, UserAuthorizationService>();
        services.AddScoped<IPatientAuthorizationService, PatientAuthorizationService>();
        services.AddScoped<IMedicalRecordAuthorizationService, MedicalRecordAuthorizationService>();
        services.AddScoped<IXrayAuthorizationService, XrayAuthorizationService>();
        services.AddScoped<IHematologyAuthorizationService, HematologyAuthorizationService>();
        services.AddScoped<IDepartmentAuthorizationService, DepartmentAuthorizationService>();
        services.AddScoped<IUserNotificationAuthorizationService, UserNotificationAuthorizationService>();
        services.AddScoped<IStatisticsAuthorizationService, StatisticsAuthorizationService>();

        // Background Services
        services.AddHostedService<Worker>();
        services.AddHostedService<NotificationEmailRecoveryService>();
    }
}
