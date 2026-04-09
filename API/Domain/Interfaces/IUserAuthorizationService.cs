using Domain.Constants;
using Domain.Entities;
using Domain.Enums;

namespace Domain.Interfaces;

public interface IUserAuthorizationService
{
    Task<bool> Authorize(ResourceOperation resourceOperation);
    Task<bool> Authorize(User resource, ResourceOperation resourceOperation);
    bool Authorize(CurrentUser user, ResourceOperation resourceOperation, string resourceType = nameof(User));
}