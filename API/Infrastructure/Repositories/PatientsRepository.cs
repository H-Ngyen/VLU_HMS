using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal class PatientsRepository(AppDbContext context) : BaseRepository<Patient>(context), IPatientsRepository
{
    public async Task<int> CreateAsync(Patient patient)
    {
        _dbContext.Add(patient);
        await SaveChanges();
        return  patient.Id;
    }

    public async Task<IEnumerable<Patient>> GetAllAsync()
        => await NoTrackingQuery
            .Include(p => p.Ethnicity)
            .ToListAsync();

    public async Task<Patient?> GetByIdAsync(int id)
        => await TrackingQuery
            .Include(p => p.Ethnicity)
            .FirstOrDefaultAsync(p => p.Id == id);

    public async Task<(IEnumerable<Patient>, int)> GetAllMatchingAsync(string? searchPhrase,
        int pageSize,
        int pageNumber)
    {
        var searchPhraseLower = searchPhrase?.ToLower();

        var baseQuery = NoTrackingQuery
            .Where(r => searchPhraseLower == null || r.Name.ToLower().Contains(searchPhraseLower)
                                                   || r.HealthInsuranceNumber.ToLower().Contains(searchPhraseLower));

        var totalCount = await baseQuery.CountAsync();
        var patients = await baseQuery
            .Skip(pageSize * (pageNumber - 1))
            .Take(pageSize)
            .ToListAsync();

        return (patients, totalCount);
    }

    public async Task SaveChanges() => await _dbContext.SaveChangesAsync();

    public async Task<bool> ExistHealthInsuranceNumber(string healthInsuranceNumber)
        => await NoTrackingQuery.AnyAsync(p => p.HealthInsuranceNumber == healthInsuranceNumber);

    public async Task DeleteAsync(Patient patient)
    {
        _dbContext.Patients.Remove(patient);
        await SaveChanges();
    }
}