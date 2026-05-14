using FluentValidation;

namespace Application.XRays.Commands.ImportXray;

public class ImportXrayCommandValidator : AbstractValidator<ImportXrayCommand>
{
    public ImportXrayCommandValidator()
    {
        RuleFor(dto => dto.File)
            .NotNull().WithMessage("Thiếu tệp đính kèm")
            .Must(file => file != null && (file.ContentType == "application/pdf" || file.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase)))
            .WithMessage("Chỉ cho phép tải lên định dạng file PDF.")
            .Must(file => file != null && file.Length <= 10 * 1024 * 1024)
            .WithMessage("Dung lượng file không được vượt quá 10MB.");

        // var today = DateOnly.FromDateTime(dateTimeProvider.Now);

        // RuleFor(dto => dto.DepartmentName)
        //     .NotEmpty().WithMessage("Tên khoa/phòng không được để trống.")
        //     .MaximumLength(255).WithMessage("Tên khoa/phòng không được vượt quá 255 ký tự.");

        // RuleFor(dto => dto.RequestDescription)
        //     .NotEmpty().WithMessage("Nội dung yêu cầu không được để trống.")
        //     .MaximumLength(1000).WithMessage("Nội dung yêu cầu không được vượt quá 1000 ký tự.");

        // RuleFor(dto => dto.RequestedAt)
        //     .LessThanOrEqualTo(today).WithMessage("Ngày yêu cầu không được lớn hơn ngày hiện tại.")
        //     .GreaterThan(today.AddYears(-150)).WithMessage("Ngày yêu cầu nhập bị sai.");
    }
}