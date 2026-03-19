using Domain.Entities;

namespace Domain.Repositories;

public interface IXRayRepository
{
    public Task<int> CreateAsync(XRay entity);
    public Task SaveChanges();
}