using Domain.Constants;
using Domain.Exceptions;
using Domain.Repositories;
using MediatR;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Application.Appointments.Commands.UpdateAppointmentStatus;

public class UpdateAppointmentStatusCommandHandler(
    IAppointmentRepository appointmentRepository,
    Application.Users.IUserContext userContext) : IRequestHandler<UpdateAppointmentStatusCommand, Unit>
{
    public async Task<Unit> Handle(UpdateAppointmentStatusCommand request, CancellationToken cancellationToken)
    {
        var user = await userContext.GetCurrentUser();
        if (user == null)
        {
            throw new UnauthorizedException("User not found in database.");
        }

        var userId = user.Id;

        var appointment = await appointmentRepository.FindOneAsync(a => a.Id == request.AppointmentId);
        if (appointment == null)
        {
            throw new NotFoundException(nameof(Domain.Entities.Appointment), request.AppointmentId.ToString());
        }

        // Only Admin, Teacher (Doctor), or the assigned Doctor can update the status.
        if (user.Role == UserRoles.Patient)
        {
            throw new UnauthorizedException("Patients are not allowed to update appointment status.");
        }

        if (user.Role != UserRoles.Admin && user.Role != UserRoles.Teacher && appointment.DoctorId != userId)
        {
            throw new UnauthorizedException("You are not authorized to update this appointment.");
        }

        appointment.Status = request.Status;
        await appointmentRepository.SaveChanges();

        return Unit.Value;
    }
}
