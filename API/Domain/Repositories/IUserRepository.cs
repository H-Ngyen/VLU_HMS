using System.Linq.Expressions;
using Domain.Entities;

namespace Domain.Repositories;

public interface IUserRepository
{  
    Task<bool> ExistsAsync(Expression<Func<User, bool>> predicate);
    Task<User?> FindOneAsync(Expression<Func<User, bool>> predicate);
    Task<int> CreateAsync(User entity);

    Task<IEnumerable<User>?> GetAllAsync();
    Task<IEnumerable<User>?> GetAllAsync(Expression<Func<User, bool>> predicate); 
    Task SaveChanges();
}