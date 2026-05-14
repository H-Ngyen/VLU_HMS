using Domain.Enums;

namespace Domain.Interfaces;

public interface IStatisticsAuthorizationService
{
    Task<bool> Authorize(ResourceOperation resourceOperation);
}