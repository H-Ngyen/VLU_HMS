using FluentValidation;

namespace Application.Hematologies.Commands.ChangeStatusHematology;

public class ChangeStatusHematologyCommandValidator : AbstractValidator<ChangeStatusHematologyCommand>
{
    public ChangeStatusHematologyCommandValidator()
    {
        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Trạng thái không hợp lệ.");

        // RuleFor(x => x.DepartmentName)
        //     .NotEmpty().WithMessage("Tên khoa/phòng không được để trống.")
        //     .MaximumLength(255).WithMessage("Tên khoa/phòng không được vượt quá 255 ký tự.");
    }
}