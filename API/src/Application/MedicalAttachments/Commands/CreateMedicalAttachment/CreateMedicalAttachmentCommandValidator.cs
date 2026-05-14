using FluentValidation;

namespace Application.MedicalAttachments.Commands.CreateMedicalAttachment;

public class CreateMedicalAttachmentCommandValidator : AbstractValidator<CreateMedicalAttachmentCommand>
{
    public CreateMedicalAttachmentCommandValidator()
    {
        RuleFor(dto => dto.Name)
            .MaximumLength(100).WithMessage("Tên tệp đính kèm không được dài quá 100 ký tự.")
            .Matches(@"^[\p{L}\s]+$").WithMessage("Tên không được có ký tự đặc biệt.");

        RuleFor(dto => dto.File)
            .NotNull().WithMessage("Thiếu tệp đính kèm")
            .Must(file => file != null && (file.ContentType == "application/pdf" || file.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase)))
            .WithMessage("Chỉ cho phép tải lên định dạng file PDF.")
            .Must(file => file != null && file.Length <= 50 * 1024 * 1024)
            .WithMessage("Dung lượng file không được vượt quá 50MB.");
    }
}