using Domain.Interfaces;
using Domain.Repositories;
using Infrastructure.Configurations;
using Infrastructure.Persistence;
using Infrastructure.Repositories;
using Infrastructure.Seeders;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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
        services.AddSingleton<IMinioClient>(sp =>
        {
            return new MinioClient()
                .WithEndpoint(minioSettings.Endpoint)
                .WithCredentials(minioSettings.AccessKey, minioSettings.SecretKey)
                // .WithSSL() 
                .Build();
        });

        // configure settings
        services.Configure<FileStorageSettings>(config.GetSection("MinIO"));

        // add repositories scoped
        services.AddScoped<IPatientsRepository, PatientsRepository>();
        services.AddScoped<IUserRepository, UsersRepository>();
        services.AddScoped<IEthnicityRepository, EthnicityRepository>();
        services.AddScoped<IMedicalRecordsRepository, MedicalRecordsRepository>();
        services.AddScoped<IMedicalAttachmentRepository, MedicalAttachmentRepository>();
        services.AddScoped<IXRayRepository, XRayRepository>();
        services.AddScoped<IHematologyRepository, HematologyRepository>();

        // add seeders scoped
        services.AddScoped<ISeeder, Seeder>();

        // add services
        services.AddSingleton<IFileStorageService, FileStorageService>();
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
        services.AddScoped<IGenerateIdService, GenerateIdService>();
    }
}
