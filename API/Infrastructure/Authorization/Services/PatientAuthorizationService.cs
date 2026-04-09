using Application.Users;
using Domain.Constants;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Authorization.Services;

public class PatientAuthorizationService(ILogger<PatientAuthorizationService> logger,
    IUserContext userContext) : IPatientAuthorizationService
{
    public async Task<bool> Authorize(ResourceOperation resourceOperation)
    {
        var user = await userContext.GetCurrentUser()
            ?? throw new UnauthorizedException();
        return Authorize(user, resourceOperation);
    }
    public async Task<bool> Authorize(Patient resource, ResourceOperation resourceOperation)
    {
        var user = await userContext.GetCurrentUser()
            ?? throw new UnauthorizedException();
        return Authorize(user, resourceOperation);
    }
    public bool Authorize(CurrentUser user, ResourceOperation resourceOperation, string resourceType = nameof(Patient))
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

        if (resourceOperation == ResourceOperation.Read && UserRoles.IsInRoles(user.Role))
        {
            logger.LogInformation("Read operation - successful authorization");
            return true;
        }

        if ((resourceOperation == ResourceOperation.Create || resourceOperation == ResourceOperation.Update || resourceOperation == ResourceOperation.Delete) &&
            UserRoles.IsTeacher(user.Role))
        {
            logger.LogInformation("Create/Update/Delete operation - successful authorization");
            return true;
        }

        return false;
    }
}