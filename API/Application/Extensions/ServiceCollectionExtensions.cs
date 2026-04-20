using Application.Users;
using AutoMapper;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddApplication(this IServiceCollection services)
    {
        var applicationAssemblies = AppDomain.CurrentDomain.GetAssemblies();

        services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(applicationAssemblies));
        // register AutoMapper configuration
        services.AddSingleton(provider =>
        {
            var loggerFactory = provider.GetRequiredService<ILoggerFactory>();

            var mapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddMaps(applicationAssemblies);
            }, loggerFactory);

            return mapperConfig.CreateMapper();
        });
        
        services.AddValidatorsFromAssemblies(applicationAssemblies)
            .AddFluentValidationAutoValidation();
        
        services.AddScoped<IUserContext, UserContext>();
        services.AddHttpContextAccessor();
        services.AddSignalR();
    }
}
