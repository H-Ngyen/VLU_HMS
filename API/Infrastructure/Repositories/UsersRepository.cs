using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal class UsersRepository : BaseRepository<User>, IUserRepository
{
    public UsersRepository(AppDbContext context) : base(context) { }
    public Task<bool> ExistsAsync(int id)
        => ReadOnlyQuery.AnyAsync(u => u.Id == id);
}