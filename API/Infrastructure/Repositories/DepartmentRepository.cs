using System.Linq.Expressions;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal class DepartmentRepository(AppDbContext context) : BaseRepository<Department>(context), IDepartmentRepository
{
    public async Task<int> CreateAsync(Department entity)
    {
        _dbContext.Departments.Add(entity);
        await SaveChanges();
        return entity.Id;
    }

    public async Task DeleteAsync(Department entity)
    {
        _dbContext.Departments.Remove(entity);
        await SaveChanges();
    }

    public async Task<Department?> FindOneAsync(Expression<Func<Department, bool>> predicate)
        => await TrackingQuery
            .Include(d => d.Users).ThenInclude(u => u.Role)
            .Include(d => d.HeadUser!).ThenInclude(u => u.Role)
            .FirstOrDefaultAsync(predicate);

    public async Task<IEnumerable<Department>?> GetAllAsync()
        => await NoTrackingQuery
            .Include(d => d.Users).ThenInclude(u => u.Role)
            .Include(d => d.HeadUser!).ThenInclude(u => u.Role)
            .ToListAsync();

    public async Task SaveChanges() => await _dbContext.SaveChangesAsync();
}