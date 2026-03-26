using Application.XRays.Commands.ChangeStatusXray;
using FluentValidation;

namespace Application.XRays.Commands.ChangeStatusXRay;

public class ChangeXrayCommandValidator : AbstractValidator<ChangeXrayCommand>
{
    public ChangeXrayCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Mã X-Ray không hợp lệ.");

        RuleFor(x => x.MedicalRecordId)
            .GreaterThan(0).WithMessage("Mã hồ sơ bệnh án không hợp lệ.");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Trạng thái không hợp lệ.");

        RuleFor(x => x.DepartmentName)
            .NotEmpty().WithMessage("Tên khoa/phòng không được để trống.")
            .MaximumLength(255).WithMessage("Tên khoa/phòng không được vượt quá 255 ký tự.");
    }
}