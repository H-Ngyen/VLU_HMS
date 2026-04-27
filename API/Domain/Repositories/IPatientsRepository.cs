using Domain.Constants;
using Domain.Entities;

namespace Domain.Repositories;

public interface IPatientsRepository
{
    public Task<int> CreateAsync(Patient patient);    
    public Task<IEnumerable<Patient>> GetAllAsync();
    public Task<Patient?> GetByIdAsync(int id);
    public Task<(IEnumerable<Patient>, int)> GetAllMatchingAsync(string? searchPhrase, int pageSize, int pageNumber);
    public Task<bool> ExistHealthInsuranceNumber(string healthInsuranceNumber);
    public Task SaveChanges();
    public Task DeleteAsync(Patient patient);
}