using FluentValidation;

namespace Application.Departments.Commands.CreateDepartment;

public class CreateDepartmentCommandValidator : AbstractValidator<CreateDepartmentCommand>
{
    public CreateDepartmentCommandValidator()
    {
        RuleFor(dto => dto.Name)
            .MaximumLength(100).WithMessage("Tên bệnh nhân không được dài quá 100 ký tự.")
            .Matches(@"^[\p{L}\s]+$").WithMessage("Tên phải viết IN HOA và không chứa ký tự đặc biệt.");
    }
}