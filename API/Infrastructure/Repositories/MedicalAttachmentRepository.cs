using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal class MedicalAttachmentRepository(AppDbContext context) : BaseRepository<MedicalAttachment>(context), IMedicalAttachmentRepository
{
    public async Task<int> CreateAsync(MedicalAttachment entity)
    {
        _dbContext.MedicalAttachments.Add(entity);
        await _dbContext.SaveChangesAsync();
        return entity.Id;
    }

    public async Task<IEnumerable<MedicalAttachment>> GetAllAsync()
        => await NoTrackingQuery
            .ToListAsync();

    public async Task<IEnumerable<MedicalAttachment>> GetAllByIdAsync(int id)
        => await NoTrackingQuery
            .Where(x => x.MedicalRecordId == id)
            .ToListAsync();

    public async Task<MedicalAttachment?> GetByIdAsync(int id)
        => await TrackingQuery
            .FirstOrDefaultAsync(x => x.Id == id);

    public async Task SaveChanges()
        => await _dbContext.SaveChangesAsync();
}