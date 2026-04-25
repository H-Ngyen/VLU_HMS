using FluentValidation;

using Domain.Interfaces;

namespace Application.XRays.Commands.UpdateCompleteXray;

public class UpdateCompleteXrayValidator : AbstractValidator<UpdateCompleteXrayCommand>
{
    public UpdateCompleteXrayValidator(IDateTimeProvider dateTimeProvider)
    {
        var today = DateOnly.FromDateTime(dateTimeProvider.Now);

        RuleFor(x => x.ResultDescription)
            // .NotEmpty().WithMessage("Kết quả chẩn đoán không được để trống.")
            .MaximumLength(4000).WithMessage("Kết quả chẩn đoán không được vượt quá 4000 ký tự.");

        RuleFor(x => x.DoctorAdvice)
            .MaximumLength(2000).WithMessage("Lời dặn bác sĩ không được vượt quá 2000 ký tự.");

        RuleFor(x => x.DepartmentOfHealth)
            .MaximumLength(255).WithMessage("Sở y tế không được vượt quá 255 ký tự.");

        RuleFor(x => x.HospitalName)
            .MaximumLength(255).WithMessage("Tên bệnh viện không được vượt quá 255 ký tự.");

        RuleFor(x => x.FormNumber)
            .MaximumLength(50).WithMessage("Mẫu số không được vượt quá 50 ký tự.");

        RuleFor(x => x.RoomNumber)
            .MaximumLength(50).WithMessage("Số buồng không được vượt quá 50 ký tự.");

        // RuleFor(x => x.BedNumber)
        //     .MaximumLength(50).WithMessage("Số giường không được vượt quá 50 ký tự.");

        RuleFor(x => x.CompletedAt)
            .LessThanOrEqualTo(today).WithMessage("Ngày hoàn thành không được lớn hơn ngày hiện tại.")
            .When(x => x.CompletedAt.HasValue);
    }
}