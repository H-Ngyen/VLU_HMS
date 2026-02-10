namespace Domain.Repositories;

public interface IUserRepository
{  
    public Task<bool> ExistsAsync(int id);
}