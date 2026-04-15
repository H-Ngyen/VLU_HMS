using Application.Users;
using Domain.Constants;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Authorization.Services;

public class DepartmentAuthorizationService(ILogger<DepartmentAuthorizationService> logger, IUserContext userContext) : IDepartmentAuthorizationService
{
    public async Task<bool> Authorize(ResourceOperation resourceOperation, Department? resource)
    {
        var user = await userContext.GetCurrentUser()
            ?? throw new UnauthorizedException();
        return Authorize(user, resourceOperation, resource ?? null);
    }

    public bool Authorize(CurrentUser user,
        ResourceOperation resourceOperation,
        Department? resource = null,
        DepartmentAction action = DepartmentAction.Default,
        string resourceType = nameof(Department))
    {
        logger.LogInformation("Authorizing user {UserEmail}, to {Operation} for resource {ResourceName} with action {Action}",
            user.Email,
            resourceOperation,
            resourceType,
            action);

        // Admin: "I'm god"
        if (UserRoles.IsAdmin(user.Role))
        {
            logger.LogInformation("Admin User, Create/Update/Read/Delete operation - successful authorization");
            return true;
        }

        if (resource != null)
        {
            if (resourceOperation == ResourceOperation.Update
                && UserRoles.IsTeacher(user.Role)
                && resource.HeadUserId == user.Id
                && action == DepartmentAction.AssignUser)
            {
                logger.LogInformation("Update operation, action {Action}- successful authorization", DepartmentAction.AssignUser);
                return true;
            }
        }

        return false;
    }
}