using Domain.Entities;

namespace Domain.Repositories;

public interface IHematologyRepository
{
    Task<int> CreateAsync(Hematology entity);    
    Task SaveChanges();
}