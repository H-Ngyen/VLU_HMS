using Domain.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services;

public class Worker(IBackgroundTaskQueue queue,
    ILogger<Worker> logger,
    IServiceProvider serviceProvider) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("Worker started");

        while (!stoppingToken.IsCancellationRequested)
        {
            var workItem = await queue.DequeueAsync(stoppingToken);

            try
            {
                using var scope = serviceProvider.CreateScope();
                await workItem.Work(scope.ServiceProvider, stoppingToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error executing background job");
            }
            finally
            {
                queue.Release(workItem.Key);
            }
        }
    }
}