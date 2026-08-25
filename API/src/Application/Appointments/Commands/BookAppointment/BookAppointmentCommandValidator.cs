using FluentValidation;

namespace Application.Appointments.Commands.BookAppointment;

public class BookAppointmentCommandValidator : AbstractValidator<BookAppointmentCommand>
{
    public BookAppointmentCommandValidator()
    {
        RuleFor(v => v.Date)
            .NotEmpty().WithMessage("Date is required.")
            .GreaterThanOrEqualTo(DateTime.UtcNow.Date).WithMessage("Appointment date must be in the future.");

        RuleFor(v => v.Reason)
            .NotEmpty().WithMessage("Reason is required.")
            .MaximumLength(500).WithMessage("Reason must not exceed 500 characters.");
    }
}
