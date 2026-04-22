using System.Linq.Expressions;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal class XRayRepository(AppDbContext context) : BaseRepository<XRay>(context), IXRayRepository
{
    public async Task<int> CreateAsync(XRay entity)
    {
        _dbContext.XRays.Add(entity);
        await SaveChanges();
        return entity.Id;
    }

    public async Task DeleteAsync(XRay entity)
    {
        _dbContext.XRays.Remove(entity);
        await SaveChanges();
    }

    public async Task<XRay?> FindOneAsync(Expression<Func<XRay, bool>> predicate)
        => await TrackingQuery
            .Include(x => x.XRayStatusLogs)
            .Include(x => x.MedicalRecord)
            .FirstOrDefaultAsync(predicate);

    public async Task<XRay?> GetByIdAsync(int id)
        => await TrackingQuery
            .Include(x => x.XRayStatusLogs)
            .Include(x => x.MedicalRecord)
            .FirstOrDefaultAsync(x => x.Id == id);

    public async Task SaveChanges() => await _dbContext.SaveChangesAsync();

}