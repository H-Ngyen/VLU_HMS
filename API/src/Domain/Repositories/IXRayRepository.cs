using System.Linq.Expressions;
using Domain.Entities;

namespace Domain.Repositories;

public interface IXRayRepository
{
    public Task<int> CreateAsync(XRay entity);
    public Task<XRay?> GetByIdAsync(int id);
    Task<XRay?> FindOneAsync(Expression<Func<XRay, bool>> predicate);
    Task DeleteAsync(XRay entity);
    public Task SaveChanges();
}