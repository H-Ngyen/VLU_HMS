using Domain.Interfaces;
using Domain.Repositories;
using Infrastructure.Persistence;
using Infrastructure.Repositories;
using Infrastructure.Seeders;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        var ConnectionString = config.GetConnectionString("HopitalManagementDB");
        services.AddDbContext<AppDbContext>(options => options.UseSqlServer(ConnectionString));

        services.AddScoped<ISeeder, Seeder>();
        services.AddScoped<IPatientsRepository, PatientsRepository>();
        services.AddScoped<IUserRepository, UsersRepository>();
        services.AddScoped<IEthnicityRepository, EthnicityRepository>();

        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();   
    }
}
