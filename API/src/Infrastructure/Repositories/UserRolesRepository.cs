using System.Linq.Expressions;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal class UserRolesRepository(AppDbContext dbContext) : BaseRepository<Role>(dbContext), IUserRoleRepository
{
    public async Task<Role?> GetUserRoleAsync(Expression<Func<Role, bool>> predicate)
        => await TrackingQuery.FirstOrDefaultAsync(predicate);
}