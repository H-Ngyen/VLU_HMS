using Domain.Interfaces;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services;

public class NotificationEmailJobService(ILogger<NotificationEmailJobService> logger,
    INotificationRepository notificationRepository,
    IEmailService emailService,
    IDateTimeProvider dateTimeProvider) : INotificationEmailJobService
{
    public async Task Job(int notificationId, int userId, string toEmail, CancellationToken ct)
    {
        logger.LogInformation("Sending notification {notificationId} to email {email}", notificationId, toEmail);
        var notification = await notificationRepository.GetByIdAsync(notificationId);
        if (notification == null) return;

        var userNotification = notification.UserNotifications.FirstOrDefault(x => x.UserId == userId);
        if (userNotification == null) return;
        if (userNotification.IsEmailSend == true) return;

        var isSuccess = await emailService.SendAsync(notification.EmailTitle, notification.EmailContent, toEmail);
        if (!isSuccess) return;

        userNotification.EmailSentAt = dateTimeProvider.Now;
        userNotification.IsEmailSend = isSuccess;

        await notificationRepository.SaveChanges();
    }
}