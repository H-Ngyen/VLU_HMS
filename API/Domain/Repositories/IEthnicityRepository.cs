using Domain.Entities;

namespace Domain.Repositories;

public interface IEthnicityRepository 
{
    public Task<bool> ExistsAsync(int id);
}