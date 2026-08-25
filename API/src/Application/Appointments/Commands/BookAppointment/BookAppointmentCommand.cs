using MediatR;

namespace Application.Appointments.Commands.BookAppointment;

public class BookAppointmentResponse
{
    public required int AppointmentId { get; set; }
    public required DateTime AppointmentDate { get; set; }
    public required TimeSpan StartTime { get; set; }
    public required TimeSpan EndTime { get; set; }
    public required string DoctorName { get; set; }
}

public class BookAppointmentCommand : IRequest<BookAppointmentResponse>
{
    public required DateTime Date { get; set; }
    public required string Reason { get; set; }
}
