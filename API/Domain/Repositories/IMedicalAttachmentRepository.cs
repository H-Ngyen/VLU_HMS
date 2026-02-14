using Domain.Entities;

namespace Domain.Repositories;

public interface IMedicalAttachmentRepository
{
    public Task<int> CreateAsync(MedicalAttachment entity);
}