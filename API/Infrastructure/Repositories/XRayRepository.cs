using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal class XRayRepository(AppDbContext context) : BaseRepository<XRay>(context), IXRayRepository
{
    public async Task CreateAsync(XRay entity)
    {
        _dbContext.XRays.Add(entity);
        await SaveChanges();
        // return entity.Id;
    }

    public async Task<XRay?> GetByIdAsync(int id)
        => await TrackingQuery.FirstOrDefaultAsync(x => x.Id == id);

    public async Task SaveChanges() => await _dbContext.SaveChangesAsync();

}