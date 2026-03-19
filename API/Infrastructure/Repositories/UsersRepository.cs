using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal class UsersRepository(AppDbContext context) : BaseRepository<User>(context), IUserRepository
{
    public async Task<bool> ExistsAsync(int id)
        => await NoTrackingQuery.AnyAsync(u => u.Id == id);
}