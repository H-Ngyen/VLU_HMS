using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        // var ConnectionString = config.GetConnectionString("RestaurantsDb");
        var ConnectionString = "Server=localhost;Database=HopitalManagementDB5;User Id=sa;Password=123456;TrustServerCertificate=True;";
        services.AddDbContext<AppDbContext>(options => options.UseSqlServer(ConnectionString));

        // services.AddScoped<ISeeder, Seeder>();
        // services.AddScoped<IRestaurantsRepository, RestaurantsRepository>();
    }
}
