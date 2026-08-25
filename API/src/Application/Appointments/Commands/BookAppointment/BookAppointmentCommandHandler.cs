using Domain.Exceptions;
using Domain.Constants;
using Domain.Entities;
using Domain.Enums;
using Domain.Repositories;
using MediatR;

using AutoMapper;
using Application.Users;

namespace Application.Appointments.Commands.BookAppointment;

public class BookAppointmentCommandHandler(
    IUserRepository userRepository,
    IPatientsRepository patientsRepository,
    IAppointmentRepository appointmentRepository,
    IUserContext userContext,
    IMapper mapper) : IRequestHandler<BookAppointmentCommand, BookAppointmentResponse>
{
    public async Task<BookAppointmentResponse> Handle(BookAppointmentCommand request, CancellationToken cancellationToken)
    {
        var user = await userContext.GetCurrentUser();
        if (user == null)
        {
            throw new UnauthorizedException("User not found in database.");
        }

        var userId = user.Id;

        var patient = await patientsRepository.FindOneAsync(p => p.UserId == userId);
        if (patient == null)
        {
            throw new BadRequestException("You must be an onboarded Patient to book an appointment.");
        }

        // Get all doctors (Teachers or Admins)
        var doctors = await userRepository.GetAllAsync(u => u.Role.Name == UserRoles.Teacher || u.Role.Name == UserRoles.Admin);
        if (!doctors.Any())
        {
            throw new Exception("No doctors available in the system.");
        }

        // Define business hours slots (8:00 to 11:30, 13:30 to 16:30)
        var slots = new List<(TimeSpan Start, TimeSpan End)>();
        for (int hour = 8; hour < 11; hour++)
        {
            slots.Add((new TimeSpan(hour, 0, 0), new TimeSpan(hour, 30, 0)));
            slots.Add((new TimeSpan(hour, 30, 0), new TimeSpan(hour + 1, 0, 0)));
        }
        slots.Add((new TimeSpan(11, 0, 0), new TimeSpan(11, 30, 0)));

        for (int hour = 13; hour < 16; hour++)
        {
            if (hour == 13)
            {
                slots.Add((new TimeSpan(13, 30, 0), new TimeSpan(14, 0, 0)));
                continue;
            }
            slots.Add((new TimeSpan(hour, 0, 0), new TimeSpan(hour, 30, 0)));
            slots.Add((new TimeSpan(hour, 30, 0), new TimeSpan(hour + 1, 0, 0)));
        }
        slots.Add((new TimeSpan(16, 0, 0), new TimeSpan(16, 30, 0)));

        var targetDate = request.Date.Date;

        // Get existing appointments for the requested date
        var existingAppointments = await appointmentRepository.GetAllAsync(a => a.AppointmentDate == targetDate && a.Status != AppointmentStatus.Cancelled);

        // Find all available pairs of (DoctorId, TimeSlot)
        var availableSlots = new List<(int DoctorId, TimeSpan Start, TimeSpan End)>();

        foreach (var doctor in doctors)
        {
            foreach (var slot in slots)
            {
                // Check if this doctor is already booked for this slot
                bool isBooked = existingAppointments.Any(a => a.DoctorId == doctor.Id && a.StartTime == slot.Start);
                if (!isBooked)
                {
                    availableSlots.Add((doctor.Id, slot.Start, slot.End));
                }
            }
        }

        if (!availableSlots.Any())
        {
            throw new BadRequestException("There are no available slots for the selected date.");
        }

        // Check if the patient already has an appointment that day
        bool patientAlreadyBooked = existingAppointments.Any(a => a.PatientId == patient.Id);
        if (patientAlreadyBooked)
        {
            throw new BadRequestException("You already have an appointment booked on this date.");
        }

        // Randomly select an available slot
        var random = new Random();
        var selectedSlot = availableSlots[random.Next(availableSlots.Count)];
        var selectedDoctor = doctors.First(d => d.Id == selectedSlot.DoctorId);

        var appointment = new Appointment
        {
            PatientId = patient.Id,
            DoctorId = selectedDoctor.Id,
            AppointmentDate = targetDate,
            StartTime = selectedSlot.Start,
            EndTime = selectedSlot.End,
            Reason = request.Reason,
            Status = AppointmentStatus.Pending
        };

        await appointmentRepository.CreateAsync(appointment);

        var response = mapper.Map<BookAppointmentResponse>(appointment);
        response.DoctorName = selectedDoctor.Name;

        return response;
    }
}
