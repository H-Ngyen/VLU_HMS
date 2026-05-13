using Domain.Constants;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;

namespace Infrastructure.Authorization.Services;

public class NotificationAuthorizationService : INotificationAuthorizationService
{
    public Task<bool> Authorize(ResourceOperation resourceOperation, Notification? resource)
    {
        throw new NotImplementedException();
    }

    public bool Authorize(CurrentUser user, ResourceOperation resourceOperation, Notification? resource = null, string resourceType = "Notification")
    {
        throw new NotImplementedException();
    }
}