using FluentValidation;

namespace Application.Hematologies.Commands.ImportHematology;

public class ImportHematologyCommandValidator : AbstractValidator<ImportHematologyCommand>
{
    public ImportHematologyCommandValidator()
    {
        RuleFor(dto => dto.File)
            .NotNull().WithMessage("Thiếu tệp đính kèm")
            .Must(file => file != null && (file.ContentType == "application/pdf" || file.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase)))
            .WithMessage("Chỉ cho phép tải lên định dạng file PDF.")
            .Must(file => file != null && file.Length <= 15 * 1024 * 1024)
            .WithMessage("Dung lượng file không được vượt quá 15MB.");
    }
}