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
        await SaveChanges();
        return record.Id;
    }

    public async Task<string?> GetLastStorageIdForYear(string yearPrefix)
        => await _dbContext.MedicalRecords
            .Where(m => m.StorageCode != null && m.StorageCode.StartsWith(yearPrefix + "."))
            .MaxAsync(m => m.StorageCode);

    public async Task<(IEnumerable<MedicalRecord>, int)> GetAllMatchingAsync(string? searchPhrase, int pageSize, int pageNumber, RecordType? recordType)
    {
        var searchPhraseLower = searchPhrase?.ToLower();

        var baseQuery = NoTrackingQuery
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

            // xray clinical
            .Include(m => m.XRays)
                .ThenInclude(x => x.XRayStatusLogs)
                    .ThenInclude(log => log.UpdatedBy)
            .Include(m => m.XRays)
                .ThenInclude(x => x.RequestedBy)
            .Include(m => m.XRays)
                .ThenInclude(x => x.PerformedBy)

            // Hematologi clinical
            .Include(m => m.Hematologies)
                .ThenInclude(x => x.HematologyStatusLogs)
                    .ThenInclude(log => log.UpdatedBy)
            .Include(m => m.Hematologies)
                .ThenInclude(x => x.RequestedBy)
            .Include(m => m.Hematologies)
                .ThenInclude(x => x.PerformedBy) 
            .FirstOrDefaultAsync(m => m.Id == id);

    public async Task<bool> ExistAsync(int id)
        => await NoTrackingQuery.AnyAsync(m => m.Id == id);

    public async Task DeleteAsync(MedicalRecord record)
    {
        _dbContext.MedicalRecords.Remove(record);
        await SaveChanges();
    }

    public Task SaveChanges() => _dbContext.SaveChangesAsync();
}