using Application.Users;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Notifications.Commands.MarkRead;

public class MarkReadCommandHandler(ILogger<MarkReadCommandHandler> logger,
    IUserContext userContext,
    IUserNotificationRepository userNotificationRepository,
    IUserNotificationAuthorizationService userNotificationAuthorizationService,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<MarkReadCommand>
{
    public async Task Handle(MarkReadCommand request, CancellationToken cancellationToken)
    {
        var currentUser = await userContext.GetCurrentUser() ?? throw new UnauthorizedException();
        logger.LogInformation("User {UserEmail} was read {UserNotificationId}", currentUser.Email, request.Id);

        var userNotification = await userNotificationRepository.FindOneAsync(n => n.Id == request.Id)
            ?? throw new NotFoundException($"Không tìm thấy thông báo của người dùng {currentUser.Email}");

        if (!userNotificationAuthorizationService.Authorize(currentUser, ResourceOperation.Update, userNotification))
            throw new ForbidException();

        if (userNotification.IsRead) return;

        userNotification.IsRead = true;
        userNotification.ReadAt = dateTimeProvider.Now;
        
        await userNotificationRepository.SaveChanges();
    }
}