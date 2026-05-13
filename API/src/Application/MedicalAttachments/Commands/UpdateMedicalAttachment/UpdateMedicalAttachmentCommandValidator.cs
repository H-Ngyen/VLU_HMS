using FluentValidation;

namespace Application.MedicalAttachments.Commands.UpdateMedicalAttachment;

public class UpdateMedicalAttachmentCommandValidator : AbstractValidator<UpdateMedicalAttachmentCommand>
{
    public UpdateMedicalAttachmentCommandValidator()
    {
        RuleFor(dto => dto.Name)
            .MaximumLength(100).WithMessage("Tên tệp đính kèm không được dài quá 100 ký tự.")
            .Matches(@"^[\p{L}\s]+$").WithMessage("Tên không được có ký tự đặc biệt.");
    }
}