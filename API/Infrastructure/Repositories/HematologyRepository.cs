using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;

namespace Infrastructure.Repositories;

internal class HematologyRepository(AppDbContext dbContext) : BaseRepository<Hematology>(dbContext), IHematologyRepository
{
    public async Task CreateAsync(Hematology entity)
    {
        _dbContext.Add(entity);
        await SaveChanges();
    }

    public async Task SaveChanges() => await _dbContext.SaveChangesAsync();
}