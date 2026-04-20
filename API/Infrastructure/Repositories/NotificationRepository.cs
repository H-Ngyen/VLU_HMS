using System.Collections.Immutable;
using System.Linq.Expressions;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal class NotificationRepository(AppDbContext context) : BaseRepository<Notification>(context), INotificationRepository
{
    public async Task<int> CreateAsync(Notification entity)
    {
        _dbContext.Notification.Add(entity);
        await SaveChanges();
        return entity.Id;
    }
    public Task SaveChanges() => _dbContext.SaveChangesAsync();
}