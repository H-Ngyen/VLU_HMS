using Application.Users;
using Domain.Constants;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Authorization.Services;

public class XrayAuthorizationService(ILogger<XrayAuthorizationService> logger,
    IUserContext userContext) : IXrayAuthorizationService
{
    public async Task<bool> Authorize(XRay? resource, ResourceOperation resourceOperation)
    {
        var user = await userContext.GetCurrentUser()
            ?? throw new UnauthorizedException();
        return Authorize(user, resource ?? null, resourceOperation);
    }

    public bool Authorize(CurrentUser currentUser, XRay? resource, ResourceOperation resourceOperation, string resourceType = nameof(XRay))
    {
        logger.LogInformation("Authorizing user {UserEmail}, to {Operation} for resource {ResourceName}",
            currentUser.Email,
            resourceOperation,
            resourceType);

        // Admin: "I'm god"
        if (UserRoles.IsAdmin(currentUser.Role))
        {
            logger.LogInformation("Admin User, Create/Update/Read/Delete operation - successful authorization");
            return true;
        }

        if (resourceOperation == ResourceOperation.Read && UserRoles.IsInRoles(currentUser.Role))
        {
            logger.LogInformation("Read operation - successful authorization");
            return true;
        }

        if (resourceOperation == ResourceOperation.Create && UserRoles.IsTeacher(currentUser.Role))
        {
            logger.LogInformation("Create operation - successful authorization");
            return true;
        }

        if (resource != null && resourceOperation == ResourceOperation.Update && UserRoles.IsTeacher(currentUser.Role) &&
            (resource.PerformedById == null || resource.PerformedById == currentUser.Id))
        {
            logger.LogInformation("Update operation - successful authorization");
            return true;
        }

        return false;
    }
}