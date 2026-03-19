using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;

namespace Infrastructure.Repositories;

internal class XRayRepository(AppDbContext context) : BaseRepository<XRay>(context), IXRayRepository
{
    public async Task<int> CreateAsync(XRay entity)
    {
        _dbContext.XRays.Add(entity);
        await SaveChanges();
        return entity.Id;
    }

    public async Task SaveChanges() => await _dbContext.SaveChangesAsync();

}