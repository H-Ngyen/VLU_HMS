using Domain.Constants;
using Domain.Entities;
using Domain.Enums;

namespace Domain.Interfaces;

public interface IDepartmentAuthorizationService
{
    Task<bool> Authorize(ResourceOperation resourceOperation, Department? resource);
    bool Authorize(CurrentUser user, ResourceOperation resourceOperation, Department? resource = null, DepartmentAction action = DepartmentAction.Default, string resourceType = nameof(Department));
}