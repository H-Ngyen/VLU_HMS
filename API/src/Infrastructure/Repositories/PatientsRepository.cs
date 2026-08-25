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
        return patient.Id;
    }

    public async Task<IEnumerable<Patient>> GetAllAsync()
        => await NoTrackingQuery
            .Include(p => p.Ethnicity)
            .ToListAsync();

    public async Task<Patient?> GetByIdAsync(int id)
        => await TrackingQuery
            .Include(p => p.Ethnicity)
            .FirstOrDefaultAsync(p => p.Id == id);

    // public async Task<(IEnumerable<Patient>, int)> GetAllMatchingAsync(string? searchPhrase,
    //     int pageSize,
    //     int pageNumber,
    //     DateOnly? from,
    //     DateOnly? to)
    // {
    //     var searchPhraseLower = searchPhrase?.ToLower();

    //     var baseQuery = NoTrackingQuery
    //         .Where(r =>
    //             (from == null || DateOnly.FromDateTime(r.CreatedAt) >= from) &&
    //             (to == null || DateOnly.FromDateTime(r.CreatedAt) <= to) &&
    //             (searchPhraseLower == null || r.Name.ToLower().Contains(searchPhraseLower)
    //                                                || r.HealthInsuranceNumber.ToLower().Contains(searchPhraseLower)));

    //     var totalCount = await baseQuery.CountAsync();
    //     var patients = await baseQuery
    //         .OrderByDescending(p => p.Id)
    //         .Skip(pageSize * (pageNumber - 1))
    //         .Take(pageSize)
    //         .ToListAsync();

    //     return (patients, totalCount);
    // }

    public async Task<(IEnumerable<Patient>, int)> GetAllMatchingAsync(
        string? searchPhrase,
        int pageSize,
        int pageNumber,
        DateOnly? from,
        DateOnly? to)
    {
        var query = NoTrackingQuery.AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchPhrase))
        {
            var pattern = $"%{searchPhrase}%";
            query = query.Where(r => EF.Functions.ILike(r.Name, pattern)
                                  || EF.Functions.ILike(r.HealthInsuranceNumber, pattern));
        }

        if (from.HasValue)
        {
            var fromDateTime = from.Value.ToDateTime(TimeOnly.MinValue);
            query = query.Where(r => r.CreatedAt >= fromDateTime);
        }

        if (to.HasValue)
        {
            var toDateTime = to.Value.ToDateTime(TimeOnly.MaxValue);
            query = query.Where(r => r.CreatedAt <= toDateTime);
        }

        var totalCount = await query.CountAsync();

        var patients = await query
            .OrderByDescending(p => p.Id)
            .Skip(pageSize * (pageNumber - 1))
            .Take(pageSize)
            .Include(p => p.Ethnicity)
            .ToListAsync();

        return (patients, totalCount);
    }

    public async Task SaveChanges() => await _dbContext.SaveChangesAsync();

    public async Task<bool> ExistHealthInsuranceNumber(string healthInsuranceNumber)
        => await NoTrackingQuery.AnyAsync(p => p.HealthInsuranceNumber == healthInsuranceNumber);

    public async Task<Patient?> FindOneAsync(System.Linq.Expressions.Expression<Func<Patient, bool>> predicate)
    {
        return await TrackingQuery.Include(p => p.Ethnicity).FirstOrDefaultAsync(predicate);
    }

    public async Task UpdateAsync(Patient patient)
    {
        _dbContext.Update(patient);
        await SaveChanges();
    }

    public async Task DeleteAsync(Patient patient)
    {
        _dbContext.Patients.Remove(patient);
        await SaveChanges();
    }
}