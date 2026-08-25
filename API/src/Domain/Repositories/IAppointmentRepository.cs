using System.Linq.Expressions;
using Domain.Entities;

namespace Domain.Repositories;

public interface IAppointmentRepository
{
    Task<Appointment?> FindOneAsync(Expression<Func<Appointment, bool>> predicate);
    Task<IEnumerable<Appointment>> GetAllAsync(Expression<Func<Appointment, bool>> predicate);
    Task<int> CreateAsync(Appointment entity);
    Task SaveChanges();
}
