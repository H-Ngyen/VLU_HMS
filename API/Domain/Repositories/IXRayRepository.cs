using Domain.Entities;

namespace Domain.Repositories;

public interface IXRayRepository
{
    public Task CreateAsync(XRay entity);
    public Task<XRay?> GetByIdAsync(int id);
    public Task SaveChanges();
}