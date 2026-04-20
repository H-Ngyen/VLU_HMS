using Domain.Constants;
using Domain.Entities;
using Domain.Enums;

namespace Domain.Interfaces;

public interface INotificationAuthorizationService
{
    Task<bool> Authorize(ResourceOperation resourceOperation, Notification? resource);
    bool Authorize(CurrentUser user, ResourceOperation resourceOperation, Notification? resource = null, string resourceType = nameof(Notification));
}