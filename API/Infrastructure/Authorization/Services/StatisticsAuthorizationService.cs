using Application.Users;
using Domain.Constants;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Authorization.Services;

public class StatisticsAuthorizationService(ILogger<StatisticsAuthorizationService> logger,
    IUserContext userContext) : IStatisticsAuthorizationService
{
    public async Task<bool> Authorize(ResourceOperation resourceOperation)
    {
        var user = await userContext.GetCurrentUser()
            ?? throw new UnauthorizedException();

        logger.LogInformation("Authorizing user {UserEmail} for Statistics operation {Operation}", 
            user.Email, resourceOperation);

        if (resourceOperation == ResourceOperation.Read)
        {
            if (UserRoles.IsAdmin(user.Role) || UserRoles.IsTeacher(user.Role))
            {
                logger.LogInformation("User has Admin or Teacher role, access granted.");
                return true;
            }
        }

        logger.LogWarning("User {UserEmail} does not have permission for Statistics {Operation}", 
            user.Email, resourceOperation);
        return false;
    }
}