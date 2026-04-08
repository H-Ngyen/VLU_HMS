using Application.Users;
using Domain.Constants;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Authorization.Services;

public class HematologyAuthorizationService(ILogger<HematologyAuthorizationService> logger,
    IUserContext userContext) : IHematologyAuthorizationService
{
    public async Task<bool> Authorize(Hematology resource, ResourceOperation resourceOperation)
    {
        var user = await userContext.GetCurrentUser();
        return Authorize(user, resource, resourceOperation);
    }

    public bool Authorize(CurrentUser currentUser, Hematology resource, ResourceOperation resourceOperation, string resourceType = "Hematology")
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

        if (resourceOperation == ResourceOperation.Create && currentUser.Role == UserRoles.Teacher)
        {
            logger.LogInformation("Create operation - successful authorization");
            return true;
        }

        if (resourceOperation == ResourceOperation.Update && currentUser.Role == UserRoles.Teacher &&
            (resource.PerformedById == null || resource.PerformedById == currentUser.Id))
        {
            logger.LogInformation("Update operation - successful authorization");
            return true;
        }

        return false;
    }
}