using Domain.Constants;
using Domain.Entities;

namespace Domain.Interfaces;

public interface IMedicalRecordAuthorizationService
{
    Task<bool> Authorize(ResourceOperation resourceOperation);
    Task<bool> Authorize(MedicalRecord resource, ResourceOperation resourceOperation);
    public bool Authorize(CurrentUser currentUser, ResourceOperation resourceOperation, string resourceType = nameof(MedicalRecord));
}