using Domain.Constants;
using Domain.Entities;
using Domain.Enums;

namespace Domain.Interfaces;

public interface IUserNotificationAuthorizationService
{
    Task<bool> Authorize(ResourceOperation resourceOperation, UserNotification? resource);
    bool Authorize(CurrentUser user, ResourceOperation resourceOperation, UserNotification? resource = null, string resourceType = nameof(UserNotification));

}