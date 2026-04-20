using System.Linq.Expressions;
using Domain.Entities;

namespace Domain.Repositories;

public interface INotificationRepository
{
    Task<int> CreateAsync(Notification entity);
    // Task<IEnumerable<Notification>> GetCurrentUserNotifications(int userId);
}