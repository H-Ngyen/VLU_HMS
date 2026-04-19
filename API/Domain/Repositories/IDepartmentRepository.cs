using System.Linq.Expressions;
using Domain.Entities;

namespace Domain.Repositories;

public interface IDepartmentRepository
{
    Task<int> CreateAsync(Department entity);
    Task<IEnumerable<Department>?> GetAllAsync();
    // Task<IEnumerable<Department>?> GetAllMatchAsync(Expression<Func<Department, bool>> predicate);
    Task<Department?> FindOneAsync(Expression<Func<Department, bool>> predicate);
    Task DeleteAsync(Department entity);
    Task SaveChanges();
}