using FluentValidation;

using Domain.Interfaces;

namespace Application.XRays.Commands.UpdateCompleteXray;

public class UpdateCompleteXrayValidator : AbstractValidator<UpdateCompleteXrayCommand>
{
    public UpdateCompleteXrayValidator(IDateTimeProvider dateTimeProvider)
    {
        var today = DateOnly.FromDateTime(dateTimeProvider.Now);

        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Mã X-Ray không hợp lệ.");

        RuleFor(x => x.MedicalRecordId)
            .GreaterThan(0).WithMessage("Mã hồ sơ bệnh án không hợp lệ.");

        RuleFor(x => x.ResultDescription)
            .NotEmpty().WithMessage("Kết quả chẩn đoán không được để trống.")
            .MaximumLength(4000).WithMessage("Kết quả chẩn đoán không được vượt quá 4000 ký tự.");

        RuleFor(x => x.DoctorAdvice)
            .MaximumLength(2000).WithMessage("Lời dặn bác sĩ không được vượt quá 2000 ký tự.");

        RuleFor(x => x.CompletedAt)
            .LessThanOrEqualTo(today).WithMessage("Ngày hoàn thành không được lớn hơn ngày hiện tại.")
            .When(x => x.CompletedAt.HasValue);
    }
}