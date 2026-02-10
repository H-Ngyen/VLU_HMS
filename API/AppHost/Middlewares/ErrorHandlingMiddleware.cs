using Domain.Exceptions;

namespace AppHost.Middlewares;

public class ErrorHandlingMiddleware(ILogger<ErrorHandlingMiddleware> logger) : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next.Invoke(context);

        }
        catch (ApiException ex)
        {
            context.Response.StatusCode = ex.StatusCode;
            await context.Response.WriteAsync(ex.Message);

            logger.LogWarning("{Message}", ex.Message);
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = 500;
            await context.Response.WriteAsync("Internal server error");
        
            logger.LogError(ex, ex.Message);
        }
    }
}