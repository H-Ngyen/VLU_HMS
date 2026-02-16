
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal class EthnicityRepository : BaseRepository<Ethnicity>, IEthnicityRepository
{
    public EthnicityRepository(AppDbContext context) : base(context) { }

    public async Task<bool> ExistsAsync(int id) 
        => await ReadOnlyQuery.AnyAsync(e => e.Id == id);

    // public async Task<Ethnicity?> GetByIdAsync(int id)
    //     => await _dbContext.Ethnicities.FindAsync(id);
}