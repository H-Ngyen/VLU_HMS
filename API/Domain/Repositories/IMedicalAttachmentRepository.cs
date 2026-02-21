using Domain.Entities;

namespace Domain.Repositories;

public interface IMedicalAttachmentRepository
{
    public Task<int> CreateAsync(MedicalAttachment entity);
    public Task<IEnumerable<MedicalAttachment>> GetAllAsync();
    public Task<IEnumerable<MedicalAttachment>> GetAllByIdAsync(int id);
    public Task<MedicalAttachment?> GetByIdAsync(int id);
    public Task SaveChanges();
}