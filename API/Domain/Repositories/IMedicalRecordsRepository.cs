using Domain.Entities;
using Domain.Enums;

namespace Domain.Repositories;

public interface IMedicalRecordsRepository
{
    public Task<int> CreateAsync(MedicalRecord record);
    public Task<string?> GetLastStorageIdForYear(string yearPrefix);
    public Task<(IEnumerable<MedicalRecord>, int)> GetAllMatchingAsync(string? searchPhrase, int pageSize, int pageNumber, RecordType? recordType);
    public Task<MedicalRecord?> GetByIdAsync(int id);
    public Task<bool> ExistAsync(int id);
    public Task DeleteAsync(MedicalRecord record);
    public Task SaveChanges();
}