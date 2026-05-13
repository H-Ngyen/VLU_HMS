using Domain.Entities;

namespace Domain.Repositories;

public interface IEthnicityRepository 
{
    public Task<IEnumerable<Ethnicity>> GetAllAsync();
    public Task<bool> ExistsAsync(int id);
}