using Domain.Interfaces;
using Domain.Repositories;
using Infrastructure.Authorization.Services;
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

        // Add Authentication Services
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.Authority = config["Auth0:Authority"];
            options.Audience = config["Auth0:Audience"];
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
        services.AddScoped<IUserAuthorizationService, UserAuthorizationService>();
        services.AddScoped<IPatientAuthorizationService, PatientAuthorizationService>();
        services.AddScoped<IMedicalRecordAuthorizationService, MedicalRecordAuthorizationService>();
        services.AddScoped<IXrayAuthorizationService, XrayAuthorizationService>();
        services.AddScoped<IHematologyAuthorizationService, HematologyAuthorizationService>();

        // add seeders scoped
        services.AddScoped<ISeeder, Seeder>();

        // add services
        services.AddSingleton<IFileStorageService, FileStorageService>();
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
        services.AddScoped<IGenerateIdService, GenerateIdService>();
        services.AddScoped<IPdfProcessorService, PdfProcessorService>();
        services.AddHttpClient<IGeminiClientService, GeminiClientService>();
    }
}
