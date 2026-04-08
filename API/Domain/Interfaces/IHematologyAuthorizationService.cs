using Domain.Constants;
using Domain.Entities;

namespace Domain.Interfaces;

public interface IHematologyAuthorizationService
{
    Task<bool> Authorize(Hematology resource, ResourceOperation resourceOperation);
    bool Authorize(CurrentUser currentUser, Hematology resource, ResourceOperation resourceOperation, string resourceType = nameof(Hematology));
}