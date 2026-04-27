using System.Linq.Expressions;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal class UsersRepository(AppDbContext context) : BaseRepository<User>(context), IUserRepository
{
    public async Task<int> CreateAsync(User entity)
    {
        _dbContext.Users.Add(entity);
        await SaveChanges();
        return entity.Id;
    }

    public async Task<bool> ExistsAsync(Expression<Func<User, bool>> predicate)
        => await NoTrackingQuery.AnyAsync(predicate);

    public async Task<User?> FindOneAsync(Expression<Func<User, bool>> predicate)
        => await TrackingQuery
                .Include(u => u.Role)
                .FirstOrDefaultAsync(predicate);

    public async Task<IEnumerable<User>> GetAllAsync()
        => await NoTrackingQuery
                .Include(u => u.Role)
                .ToListAsync();
    public async Task<IEnumerable<User>> GetAllAsync(Expression<Func<User, bool>> predicate)
        => await NoTrackingQuery
                .Include(u => u.Role)
                .Where(predicate)
                .ToListAsync();

    public async Task<IEnumerable<User>> GetListByIdsAsync(IEnumerable<int> ids)
        => await NoTrackingQuery
            .Where(u => ids.Contains(u.Id))
            .Include(u => u.Role)
            .ToListAsync();

    public async Task SaveChanges()
        => await _dbContext.SaveChangesAsync();
}