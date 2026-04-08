using Domain.Constants;
using Domain.Entities;

namespace Domain.Interfaces;

public interface IPatientAuthorizationService
{
    Task<bool> Authorize(ResourceOperation resourceOperation);
    Task<bool> Authorize(Patient resource, ResourceOperation resourceOperation);
    bool Authorize(CurrentUser user, ResourceOperation resourceOperation, string resourceType = nameof(Patient));
}