using System.Linq.Expressions;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal class UserNotificationRepository(AppDbContext context) : BaseRepository<UserNotification>(context), IUserNotificationRepository
{
    public async Task<UserNotification?> FindOneAsync(Expression<Func<UserNotification, bool>> predicate)
        => await TrackingQuery
            .Include(n => n.Notification)
            .FirstOrDefaultAsync(predicate);

    public async Task<IEnumerable<UserNotification>> GetCurrentUserNotifications(int userId)
        => await NoTrackingQuery
            .Where(n => n.UserId == userId)
            .Include(n => n.Notification)
            .OrderByDescending(n => n.Notification.CreatedAt)
            .ToListAsync();

    public async Task SaveChanges()
        => await _dbContext.SaveChangesAsync();
}