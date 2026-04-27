using System.Linq.Expressions;
using Domain.Entities;

namespace Domain.Repositories;

public interface IHematologyRepository
{
    Task<int> CreateAsync(Hematology entity);
    Task<Hematology?> FindOneAsync(Expression<Func<Hematology, bool>> predicate);
    Task DeleteAsync(Hematology entity);
    Task SaveChanges();
}