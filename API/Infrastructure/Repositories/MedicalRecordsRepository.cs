using Domain.Constants;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal class MedicalRecordsRepository(AppDbContext context) : BaseRepository<MedicalRecord>(context), IMedicalRecordsRepository
{
    public async Task<int> CreateAsync(MedicalRecord record)
    {
        _dbContext.MedicalRecords.Add(record);
        await _dbContext.SaveChangesAsync();
        return record.Id;
    }

    public async Task<string?> GetLastStorageIdForYear(string yearPrefix)
        => await _dbContext.MedicalRecords
            .Where(m => m.StorageCode != null && m.StorageCode.StartsWith(yearPrefix + "."))
            .MaxAsync(m => m.StorageCode);

    public async Task<(IEnumerable<MedicalRecord>, int)> GetAllMatchingAsync(string? searchPhrase, int pageSize, int pageNumber, RecordType? recordType)
    {
        var searchPhraseLower = searchPhrase?.ToLower();

        var baseQuery = ReadOnlyQuery
            .Include(m => m.Patient)
            .Where(r =>
                (recordType == null || r.RecordType == recordType) &&
                (searchPhraseLower == null || (r.StorageCode != null && r.StorageCode.ToLower().Contains(searchPhraseLower))
                                                    || r.Patient.Name.ToLower().Contains(searchPhraseLower)
                                                    || r.Patient.HealthInsuranceNumber.ToLower().Contains(searchPhraseLower)));

        var totalCount = await baseQuery.CountAsync();
        var records = await baseQuery
            .OrderByDescending(m => m.AdmissionTime)
            .Skip(pageSize * (pageNumber - 1))
            .Take(pageSize)
            .ToListAsync();

        return (records, totalCount);
    }

    public async Task<MedicalRecord?> GetByIdAsync(int id)
        => await TrackingQuery
            .Include(m => m.DepartmentTransfers)
            .Include(m => m.Patient)
                .ThenInclude(p => p.Ethnicity)
            .Include(m => m.Detail)
                .ThenInclude(d => d!.RiskFactors)
            .FirstOrDefaultAsync(m => m.Id == id);

    public async Task<bool> ExistAsync(int id)
        => await ReadOnlyQuery.AnyAsync(m => m.Id == id);
}