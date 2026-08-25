using Domain.Constants;
using Domain.Entities;

namespace Domain.Repositories;

public interface IPatientsRepository
{
    public Task<int> CreateAsync(Patient patient);    
    public Task<IEnumerable<Patient>> GetAllAsync();
    public Task<Patient?> GetByIdAsync(int id);
    public Task<(IEnumerable<Patient>, int)> GetAllMatchingAsync(string? searchPhrase, int pageSize, int pageNumber, DateOnly? from, DateOnly? to);
    public Task<bool> ExistHealthInsuranceNumber(string healthInsuranceNumber);
    public Task SaveChanges();
    public Task<Patient?> FindOneAsync(System.Linq.Expressions.Expression<Func<Patient, bool>> predicate);
    public Task UpdateAsync(Patient patient);
    public Task DeleteAsync(Patient patient);
}