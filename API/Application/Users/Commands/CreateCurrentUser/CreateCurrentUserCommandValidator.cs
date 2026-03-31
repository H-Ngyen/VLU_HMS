using Domain.Constants;
using FluentValidation;

namespace Application.Users.Commands.CreateCurrentUser;

public class CreateCurrentUserCommandValidator : AbstractValidator<CreateCurrentUserCommand>
{
    public CreateCurrentUserCommandValidator()
    {
        // RuleFor(x => x.Auth0Id)
            // .NotEmpty().WithMessage("Auth0Id không được để trống.");

        RuleFor(x => x.Email)
            // .NotEmpty().WithMessage("Email không được để trống.")
            .EmailAddress().WithMessage("Định dạng email không hợp lệ.")
            .Must(value => EmailDomain.IsInDomain(value)).WithMessage(value => $"Email không được phép truy cập vào hệ thống {value}");

        RuleFor(x => x.Name)
            // .NotEmpty().WithMessage("Tên người dùng không được để trống.")
            .MaximumLength(100).WithMessage("Tên người dùng không được vượt quá 100 ký tự.");

        // RuleFor(x => x.PictureUrl)
            // .NotEmpty().WithMessage("Ảnh đại diện không được để trống.");

        // RuleFor(x => x.UpdateAt)
            // .NotEmpty().WithMessage("Thời gian cập nhật không được để trống.");
    }
}