using System.Linq.Expressions;
using Domain.Entities;

namespace Domain.Repositories;

public interface IUserRoleRepository
{
    Task<Role?> GetUserRoleAsync(Expression<Func<Role, bool>> predicate);
}