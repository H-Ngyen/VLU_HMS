using Domain.Exceptions;
using Domain.Constants;
using Domain.Repositories;
using MediatR;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

using AutoMapper;

namespace Application.Appointments.Queries.GetMyAppointments;

public class GetMyAppointmentsQueryHandler(
    IAppointmentRepository appointmentRepository,
    Application.Users.IUserContext userContext,
    IMapper mapper) : IRequestHandler<GetMyAppointmentsQuery, IEnumerable<AppointmentDto>>
{
    public async Task<IEnumerable<AppointmentDto>> Handle(GetMyAppointmentsQuery request, CancellationToken cancellationToken)
    {
        var user = await userContext.GetCurrentUser();
        if (user == null)
        {
            throw new UnauthorizedException("User not found in database.");
        }

        var userId = user.Id;

        IEnumerable<Domain.Entities.Appointment> appointments;

        if (user.Role == UserRoles.Patient)
        {
            appointments = await appointmentRepository.GetAllAsync(a => a.Patient.UserId == userId);
        }
        else if (user.Role == UserRoles.Teacher || user.Role == UserRoles.Admin)
        {
            appointments = await appointmentRepository.GetAllAsync(a => a.DoctorId == userId);
        }
        else
        {
            appointments = new List<Domain.Entities.Appointment>();
        }

        return mapper.Map<IEnumerable<AppointmentDto>>(appointments);
    }
}
