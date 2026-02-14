
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal class EthnicityRepository(AppDbContext context) : BaseRepository<Ethnicity>(context), IEthnicityRepository
{
    public async Task<bool> ExistsAsync(int id) 
        => await ReadOnlyQuery.AnyAsync(e => e.Id == id);

    // public async Task<Ethnicity?> GetByIdAsync(int id)
    //     => await _dbContext.Ethnicities.FindAsync(id);
}