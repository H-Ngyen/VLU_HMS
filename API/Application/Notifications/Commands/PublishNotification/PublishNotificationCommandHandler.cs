using Application.Common;
using Application.Notifications.Dtos;
using AutoMapper;
using Domain.Constants;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Application.Notifications.Commands.PublishNotification;

public class PublishNotificationCommandHandler(ILogger<PublishNotificationCommandHandler> logger,
    // IDepartmentRepository departmentRepository,
    INotificationRepository notificationRepository,
    IHematologyRepository hematologyRepository,
    IXRayRepository xRayRepository,
    IUserRepository userRepository,
    IEmailService emailService,
    IDateTimeProvider datetimeProvider,
    IMapper mapper,
    IHubContext<NotificationHub> hubContext,
    IConfiguration config) : IRequestHandler<PublishNotificationCommand, bool>
{
    public async Task<bool> Handle(PublishNotificationCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Publishing new notification");

        var users = await userRepository.GetAllAsync();
        var listUser = users!.Where(u => request.ListUserId.Contains(u.Id)).ToList();

        var storageCode = await GetMedicalRecordId(request.ResourceId, request.ClinicalType);
        var newNotification = await CreateNewNotification(request.ResourceId, storageCode, request.NotificattionType, listUser);

        await notificationRepository.CreateAsync(newNotification);

        foreach (var user in listUser)
        {
            var userNotification = newNotification.UserNotifications.FirstOrDefault(un => un.UserId == user.Id);
            if (userNotification != null)
            {
                var dto = mapper.Map<UserNotificationDto>(userNotification);
                await hubContext.Clients
                    .User(user.Auth0Id.ToString())
                    .SendAsync("notification_received", dto, cancellationToken);
            }
        }
        return true;
    }

    private async Task<string> GetMedicalRecordId(int resourceId, ClinicalsType clinicalsType)
    {
        if (clinicalsType == ClinicalsType.Hematology)
        {
            var hematology = await hematologyRepository.FindOneAsync(h => h.Id == resourceId);
            return hematology!.MedicalRecord.StorageCode!;
        }
        else
        {
            var xray = await xRayRepository.FindOneAsync(x => x.Id == resourceId);
            return xray!.MedicalRecord.StorageCode!;
        }
    }

    private async Task<Notification> CreateNewNotification(int resourceId, string storageCode, NotificationType type, IEnumerable<User> users)
    {
        var notificationTemplate = new NotificationTemplates(config);
        var context = new NotificationTemplateContext
        {
            ResourceId = resourceId,
            StorageCode = storageCode
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