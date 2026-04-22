using Application.Common;
using Application.Notifications.Dtos;
using Application.Users;
using AutoMapper;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Application.Notifications.Queries.GetCurrentUserNotifications;

public class GetCurrentUserNotificationsQueryHandler(ILogger<GetCurrentUserNotificationsQueryHandler> logger,
    IUserContext userContext,
    IUserNotificationRepository userNotificationRepository,
    IMapper mapper,
    IConfiguration config) : IRequestHandler<GetCurrentUserNotificationsQuery, IEnumerable<UserNotificationDto>>
{
    public async Task<IEnumerable<UserNotificationDto>> Handle(GetCurrentUserNotificationsQuery request, CancellationToken cancellationToken)
    {
        var currentUser = await userContext.GetCurrentUser() ?? throw new UnauthorizedException();
        logger.LogInformation("Getting notification for user {UserEmail}", currentUser.Email);
        var userNotification = await userNotificationRepository.GetCurrentUserNotifications(currentUser.Id);

        var results = mapper.Map<IEnumerable<UserNotificationDto>>(userNotification);

        // foreach (var result in results)
        // {
        //     result.Notification.ResourceUrl
        // }

        return results;
    }

    private string GenerateNotificationUrl(
        NotificationType type,
        int resourceId,
        string storageCode)
    {
        var template = new NotificationTemplates(config);
        switch (type)
        {
            case NotificationType.HematologyInitial:
            case NotificationType.HematologyReceived:
            case NotificationType.HematologyProcessing:
            case NotificationType.HematologyCompleted:
                return template.GenerateHematologyLink(resourceId, storageCode);

            case NotificationType.XrayInitial:
            case NotificationType.XrayReceived:
            case NotificationType.XrayProcessing:
            case NotificationType.XrayCompleted:
                return template.GenerateXrayLink(resourceId, storageCode);

            default:
                return "";
        }
    }
}