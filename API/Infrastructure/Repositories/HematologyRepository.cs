using System.Linq.Expressions;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal class HematologyRepository(AppDbContext dbContext) : BaseRepository<Hematology>(dbContext), IHematologyRepository
{
    public async Task<int> CreateAsync(Hematology entity)
    {
        _dbContext.Add(entity);
        await SaveChanges();
        return entity.Id;
    }

    public async Task DeleteAsync(Hematology entity)
    {
        _dbContext.Hematologies.Remove(entity);
        await SaveChanges();
    }

    public async Task<Hematology?> FindOneAsync(Expression<Func<Hematology, bool>> predicate)
        => await TrackingQuery
            .Include(h => h.HematologyStatusLogs)
            .FirstOrDefaultAsync(predicate);

    public async Task SaveChanges() => await _dbContext.SaveChangesAsync();
}