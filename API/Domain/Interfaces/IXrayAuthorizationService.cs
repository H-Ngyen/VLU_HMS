using Domain.Constants;
using Domain.Entities;
using Domain.Enums;

namespace Domain.Interfaces;

public interface IXrayAuthorizationService
{
    Task<bool> Authorize(XRay? resource, ResourceOperation resourceOperation);
    bool Authorize(CurrentUser currentUser, XRay? resource, ResourceOperation resourceOperation, string resourceType = nameof(XRay));
}