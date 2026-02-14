using System.Text.Json.Serialization;
using AppHost.Middlewares;

namespace AppHost.Extensions;

public static class WebApplicationBuilderExtensions
{
    public static void AddPresentation(this WebApplicationBuilder builder)
    {
        builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            });
        builder.Services.AddScoped<ErrorHandlingMiddleware>();
    } 
}