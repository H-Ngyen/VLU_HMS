using Domain.Entities;

namespace Domain.Repositories;

public interface IHematologyRepository
{
    Task CreateAsync(Hematology entity);    
    Task SaveChanges();
}