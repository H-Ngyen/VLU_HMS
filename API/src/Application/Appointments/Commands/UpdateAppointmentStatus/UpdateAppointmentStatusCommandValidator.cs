using FluentValidation;

namespace Application.Appointments.Commands.UpdateAppointmentStatus;

public class UpdateAppointmentStatusCommandValidator : AbstractValidator<UpdateAppointmentStatusCommand>
{
    public UpdateAppointmentStatusCommandValidator()
    {
        RuleFor(v => v.AppointmentId)
            .GreaterThan(0).WithMessage("AppointmentId is required.");

        RuleFor(v => v.Status)
            .IsInEnum().WithMessage("Invalid Appointment Status.");
    }
}
