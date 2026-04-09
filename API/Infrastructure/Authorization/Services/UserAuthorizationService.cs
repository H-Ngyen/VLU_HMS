using Application.Users;
using Domain.Constants;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Authorization.Services;

public class UserAuthorizationService(ILogger<UserAuthorizationService> logger,
    IUserContext userContext) : IUserAuthorizationService
{
    public async Task<bool> Authorize(ResourceOperation resourceOperation)
    {
        var user = await userContext.GetCurrentUser()
            ?? throw new UnauthorizedException();
        return Authorize(user, resourceOperation);
    }
    public async Task<bool> Authorize(User resource, ResourceOperation resourceOperation)
    {
        var user = await userContext.GetCurrentUser()
            ?? throw new UnauthorizedException();
        return Authorize(user, resourceOperation);
    }
    public bool Authorize(CurrentUser user, ResourceOperation resourceOperation, string resourceType = nameof(User))
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
        return false;
    }
}