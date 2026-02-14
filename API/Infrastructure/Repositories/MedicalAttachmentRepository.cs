using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;

namespace Infrastructure.Repositories;

internal class MedicalAttachmentRepository(AppDbContext context) : BaseRepository<MedicalAttachment>(context), IMedicalAttachmentRepository
{
    public async Task<int> CreateAsync(MedicalAttachment entity)
    {
        _dbContext.MedicalAttachments.Add(entity);
        await _dbContext.SaveChangesAsync();
        return entity.Id;
    }
}