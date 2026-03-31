using Domain.Constants;
using FluentValidation;

namespace Application.Users.Commands.ChangeRole;

public class ChangeRoleUserCommandValidator : AbstractValidator<ChangeRoleUserCommand>
{
    public ChangeRoleUserCommandValidator()
    {
        RuleFor(dto => dto.Role)
            .Must(value => UserRoles.IsInRoles(value)).WithMessage("UserRole hợp lệ")
            .Must(value => !UserRoles.IsAdmin(value)).WithMessage($"Không thể thay đổi role thành {UserRoles.Admin}");
    }
}