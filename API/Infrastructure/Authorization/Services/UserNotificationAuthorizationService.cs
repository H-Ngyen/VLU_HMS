using Application.Users;
using Domain.Constants;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Authorization.Services;

public class UserNotificationAuthorizationService(ILogger<UserNotificationAuthorizationService> logger,
    IUserContext userContext) : IUserNotificationAuthorizationService
{
    public async Task<bool> Authorize(ResourceOperation resourceOperation, UserNotification? resource)
    {
        var currentUser = await userContext.GetCurrentUser() ?? throw new UnauthorizedException();
        return Authorize(currentUser, resourceOperation, resource ?? null);
    }

    public bool Authorize(CurrentUser user, ResourceOperation resourceOperation, UserNotification? resource = null, string resourceType = nameof(UserNotification))
    {
        logger.LogInformation("Authorizing user {UserEmail}, to {Operation} for resource {ResourceName}",
              user.Email,
              resourceOperation,
              resourceType);

        // Admin: "I'm god"
        if (UserRoles.IsAdmin(user.Role))
        {
            logger.LogInformation("Admin User, Create/Update/Read/Delete operation - successful authorization");
            return true;
        }

        if (resource != null)
        {
            if (resourceOperation == ResourceOperation.Read && resource.UserId == user.Id)
            {
                logger.LogInformation("Read operation - successful authorization");
                return true;
            }

            if (resourceOperation == ResourceOperation.Update && resource.UserId == user.Id)
            {
                logger.LogInformation("Update operation - successful authorization");
                return true;
            }
        }

        return false;
    }
}