using Domain.Constants;
using Domain.Interfaces;
using Domain.Repositories;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Background;

public class NotificationEmailRecoveryService(ILogger<NotificationEmailRecoveryService> logger,
    IServiceProvider serviceProvider,
    IBackgroundTaskQueue backgroundTask) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("NotificationEmailRecoveryService started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = serviceProvider.CreateScope();
                var repo = scope.ServiceProvider.GetRequiredService<IUserNotificationRepository>();
                var list = await repo.GetAllMatchAsync(x => !x.IsEmailSend);

                foreach (var item in list)
                {
                    var key = QueueKeys.KeyEmail(item.NotificationId, item.UserId);

                    backgroundTask.Enqueue(
                    new QueueItem(key, async (sp, ct) =>
                    {
                        var emailJob = sp.GetRequiredService<INotificationEmailJobService>();
                        await emailJob.Job(item.NotificationId, item.UserId, item.User.Email, ct);
                    }));
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Recovery service error");
            }

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }
}