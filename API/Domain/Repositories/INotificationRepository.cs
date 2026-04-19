using Domain.Entities;

namespace Domain.Repositories;

public interface INotificationRepository
{
    Task<int> CreateAsync(Notification entity);
}