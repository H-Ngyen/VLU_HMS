using Domain.Enums;
using MediatR;

namespace Application.Appointments.Commands.UpdateAppointmentStatus;

public class UpdateAppointmentStatusCommand : IRequest<Unit>
{
    public int AppointmentId { get; set; }
    public AppointmentStatus Status { get; set; }
}
