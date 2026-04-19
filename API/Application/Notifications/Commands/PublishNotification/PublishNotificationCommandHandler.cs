using Application.Common;
using Domain.Constants;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Notifications.Commands.PublishNotification;

public class PublishNotificationCommandHandler(ILogger<PublishNotificationCommandHandler> logger,
    // IDepartmentRepository departmentRepository,
    INotificationRepository notificationRepository,
    IHematologyRepository hematologyRepository,
    IXRayRepository xRayRepository,
    IUserRepository userRepository,
    IEmailService emailService,
    IDateTimeProvider datetimeProvider) : IRequestHandler<PublishNotificationCommand, bool>
{
    public async Task<bool> Handle(PublishNotificationCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Publishing new notification");

        var users = await userRepository.GetAllAsync();
        var listUser = users!.Where(u => request.ListUserId.Contains(u.Id));

        var medicalRecordId = await GetMedicalRecordId(request.ResourceId, request.ClinicalType);
        var newNotification = await CreateNewNotification(request.ResourceId, medicalRecordId, request.NotificattionType, listUser);

        await notificationRepository.CreateAsync(newNotification);
        return true;
    }

    private async Task<int> GetMedicalRecordId(int resourceId, ClinicalsType clinicalsType)
    {
        if (clinicalsType == ClinicalsType.Hematology)
        {
            var hematology = await hematologyRepository.FindOneAsync(h => h.Id == resourceId);
            return hematology!.MedicalRecordId;
        }
        else
        {
            var xray = await xRayRepository.FindOneAsync(x => x.Id == resourceId);
            return xray!.MedicalRecordId;
        }
    }

    private async Task<Notification> CreateNewNotification(int resourceId, int medicalRecordId, NotificationType type, IEnumerable<User> users)
    {
        var notificationTemplate = new NotificationTemplates();
        var context = new NotificationTemplateContext
        {
            ResourceId = resourceId,
            MedicalRecordId = medicalRecordId
        };
        var content = notificationTemplate.Build(type, context);

        var notification = new Notification
        {
            AppTitle = content.AppTitle,
            AppContent = content.AppContent,
            EmailTitle = content.EmailTitle,
            EmailContent = content.EmailContent,
            ResourceId = resourceId,
            Type = type,
            CreatedAt = datetimeProvider.Now
        };

        foreach (var user in users)
        {
            var isSuccess = await emailService.SendAsync(notification.EmailTitle, notification.EmailContent, user.Email);

            notification.UserNotifications.Add(
                new UserNotification
                {
                    UserId = user.Id,
                    EmailSentAt = datetimeProvider.Now,
                    IsEmailSend = isSuccess
                }
            );
        }
        return notification;
    }
}