using Domain.Enums;
using MediatR;

namespace Application.Appointments.Queries.GetMyAppointments;

public class AppointmentDto
{
    public int Id { get; set; }
    public DateTime AppointmentDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string DoctorName { get; set; } = string.Empty;
    public string PatientName { get; set; } = string.Empty;
    public AppointmentStatus Status { get; set; }
}

public class GetMyAppointmentsQuery : IRequest<IEnumerable<AppointmentDto>>
{
}
