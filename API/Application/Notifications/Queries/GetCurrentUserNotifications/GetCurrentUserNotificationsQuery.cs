using Application.Notifications.Dtos;
using MediatR;

namespace Application.Notifications.Queries.GetCurrentUserNotifications;

public class GetCurrentUserNotificationsQuery : IRequest<IEnumerable<UserNotificationDto>>
{
    // public int UserId { get; set; }
}