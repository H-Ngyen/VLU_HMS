using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal abstract class BaseRepository<T> (AppDbContext dbContext) where T : class
{
    protected AppDbContext _dbContext => dbContext; 
    protected IQueryable<T> NoTrackingQuery => _dbContext.Set<T>().AsNoTracking();
    protected IQueryable<T> TrackingQuery => _dbContext.Set<T>();
}