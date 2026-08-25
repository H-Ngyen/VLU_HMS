using System.Linq.Expressions;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

internal class AppointmentRepository(AppDbContext dbContext) : IAppointmentRepository
{
    public async Task<int> CreateAsync(Appointment entity)
    {
        await dbContext.Appointments.AddAsync(entity);
        await dbContext.SaveChangesAsync();
        return entity.Id;
    }

    public async Task<Appointment?> FindOneAsync(Expression<Func<Appointment, bool>> predicate)
    {
        return await dbContext.Appointments.FirstOrDefaultAsync(predicate);
    }

    public async Task<IEnumerable<Appointment>> GetAllAsync(Expression<Func<Appointment, bool>> predicate)
    {
        return await dbContext.Appointments
            .Include(a => a.Doctor)
            .Include(a => a.Patient)
            .Where(predicate)
            .OrderBy(a => a.AppointmentDate)
            .ThenBy(a => a.StartTime)
            .ToListAsync();
    }

    public async Task SaveChanges()
    {
        await dbContext.SaveChangesAsync();
    }
}
