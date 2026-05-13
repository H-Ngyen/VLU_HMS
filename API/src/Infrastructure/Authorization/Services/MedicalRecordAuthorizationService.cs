using Application.Users;
using Domain.Constants;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Authorization.Services;

public class MedicalRecordAuthorizationService(ILogger<MedicalRecordAuthorizationService> logger,
    IUserContext userContext) : IMedicalRecordAuthorizationService
{
    public async Task<bool> Authorize(ResourceOperation resourceOperation)
    {
        var user = await userContext.GetCurrentUser()
            ?? throw new UnauthorizedException();
        return Authorize(user, resourceOperation);
    }

    public async Task<bool> Authorize(MedicalRecord resource, ResourceOperation resourceOperation)
    {
        var user = await userContext.GetCurrentUser()
            ?? throw new UnauthorizedException();
        return Authorize(user, resourceOperation);
    }

    public bool Authorize(CurrentUser currentUser, ResourceOperation resourceOperation, string resourceType = nameof(MedicalRecord))
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

        if ((resourceOperation == ResourceOperation.Create || resourceOperation == ResourceOperation.Update || resourceOperation == ResourceOperation.Delete) &&
            UserRoles.IsTeacher(currentUser.Role))
        {
            logger.LogInformation("Create/Update/Delete operation - successful authorization");
            return true;
        }
        return false;
    }

}