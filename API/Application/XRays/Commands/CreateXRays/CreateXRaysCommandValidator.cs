using Domain.Interfaces;
using FluentValidation;

namespace Application.XRays.CreateXRays;

public class CreateXRaysCommandValidator : AbstractValidator<CreateXRaysCommand>
{
    public CreateXRaysCommandValidator(IDateTimeProvider dateTimeProvider)
    {
        RuleFor(dto => dto.RequestedAt)
            .LessThan(dateTimeProvider.Now).WithMessage("Ngày yêu cầu không được lớn hơn ngày hiện tại.")
            .GreaterThan(dateTimeProvider.Now.AddYears(-150)).WithMessage("Ngày yêu cầu nhập bị sai.");
    }
}