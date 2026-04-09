using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;

namespace Infrastructure.Repositories;

internal class HematologyRepository(AppDbContext dbContext) : BaseRepository<Hematology>(dbContext), IHematologyRepository
{
    public async Task<int> CreateAsync(Hematology entity)
    {
        _dbContext.Add(entity);
        await SaveChanges();
        return entity.Id;
    }

    public async Task SaveChanges() => await _dbContext.SaveChangesAsync();
}