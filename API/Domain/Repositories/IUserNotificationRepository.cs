using System.Linq.Expressions;
using Domain.Entities;

namespace Domain.Repositories;

public interface IUserNotificationRepository
{
    Task<IEnumerable<UserNotification>> GetCurrentUserNotifications(int userId);
    Task<UserNotification?> FindOneAsync(Expression<Func<UserNotification, bool>> predicate);
    Task SaveChanges();
}