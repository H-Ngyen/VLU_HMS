using Application.Notifications.Dtos;
using Application.Users;
using AutoMapper;
using Domain.Exceptions;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Notifications.Queries.GetCurrentUserNotifications;

public class GetCurrentUserNotificationsQueryHandler(ILogger<GetCurrentUserNotificationsQueryHandler> logger,
    IUserContext userContext,
    IUserNotificationRepository userNotificationRepository,
    IMapper mapper) : IRequestHandler<GetCurrentUserNotificationsQuery, IEnumerable<UserNotificationDto>>
{
    public async Task<IEnumerable<UserNotificationDto>> Handle(GetCurrentUserNotificationsQuery request, CancellationToken cancellationToken)
    {
        var currentUser = await userContext.GetCurrentUser() ?? throw new UnauthorizedException();
        logger.LogInformation("Getting notification for user {UserEmail}", currentUser.Email);
        
        var userNotification = await userNotificationRepository.GetCurrentUserNotifications(currentUser.Id);
        
        var result = mapper.Map<IEnumerable<UserNotificationDto>>(userNotification);
        return result;
    }
}