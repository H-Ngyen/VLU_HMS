using Domain.Interfaces;
using FluentValidation;

namespace Application.Hematologies.Commands.ImportHematologyCompleted;

public class ImportHematologyCompletedCommandValidator : AbstractValidator<ImportHematologyCompletedCommand>
{
    public ImportHematologyCompletedCommandValidator(IDateTimeProvider dateTimeProvider)
    {
        var today = DateOnly.FromDateTime(dateTimeProvider.Now);
        
        RuleFor(dto => dto.RequestDepartmentName)
            .NotEmpty().WithMessage("Tên khoa/phòng không được để trống.")
            .MaximumLength(255).WithMessage("Tên khoa/phòng không được vượt quá 255 ký tự.");

        RuleFor(dto => dto.PerformDepartmentName)
            .NotEmpty().WithMessage("Tên khoa/phòng không được để trống.")
            .MaximumLength(255).WithMessage("Tên khoa/phòng không được vượt quá 255 ký tự.");

        RuleFor(dto => dto.RequestDescription)
            .NotEmpty().WithMessage("Nội dung yêu cầu không được để trống.")
            .MaximumLength(1000).WithMessage("Nội dung yêu cầu không được vượt quá 1000 ký tự.");

        RuleFor(dto => dto.RequestedAt)
            .LessThanOrEqualTo(today).WithMessage("Ngày yêu cầu không được lớn hơn ngày hiện tại.")
            .GreaterThan(today.AddYears(-150)).WithMessage("Ngày yêu cầu nhập bị sai.");

        RuleFor(x => x.MedicalRecordId)
            .GreaterThan(0).WithMessage("Id hồ sơ bệnh án không hợp lệ.");

        // ===== CompletedAt =====
        RuleFor(x => x.CompletedAt)
            .LessThanOrEqualTo(today)
            .WithMessage("Ngày hoàn thành không được lớn hơn ngày hiện tại.");

        // ===== Chỉ số huyết học =====
        RuleFor(x => x.RedBloodCellCount)
            .GreaterThan(0).WithMessage("Số lượng hồng cầu phải lớn hơn 0.")
            .LessThan(10).WithMessage("Số lượng hồng cầu không hợp lệ.");

        RuleFor(x => x.WhiteBloodCellCount)
            .GreaterThan(0).WithMessage("Số lượng bạch cầu phải lớn hơn 0.")
            .LessThan(100).WithMessage("Số lượng bạch cầu không hợp lệ.");

        RuleFor(x => x.Hemoglobin)
            .GreaterThan(0).WithMessage("Huyết sắc tố phải lớn hơn 0.")
            .LessThan(300).WithMessage("Huyết sắc tố không hợp lệ.");

        RuleFor(x => x.Hematocrit)
            .GreaterThan(0).WithMessage("Hematocrit phải lớn hơn 0.")
            .LessThan(1).WithMessage("Hematocrit không hợp lệ.");

        RuleFor(x => x.Mcv)
            .GreaterThan(0).WithMessage("MCV phải lớn hơn 0.")
            .LessThan(200).WithMessage("MCV không hợp lệ.");

        RuleFor(x => x.Mch)
            .GreaterThan(0).WithMessage("MCH phải lớn hơn 0.")
            .LessThan(100).WithMessage("MCH không hợp lệ.");

        RuleFor(x => x.Mchc)
            .GreaterThan(0).WithMessage("MCHC phải lớn hơn 0.")
            .LessThan(500).WithMessage("MCHC không hợp lệ.");

        RuleFor(x => x.ReticulocyteCount)
            .GreaterThanOrEqualTo(0).WithMessage("Hồng cầu lưới không hợp lệ.")
            .LessThanOrEqualTo(100).WithMessage("Hồng cầu lưới không hợp lệ.");

        RuleFor(x => x.PlateletCount)
            .GreaterThan(0).WithMessage("Số lượng tiểu cầu phải lớn hơn 0.")
            .LessThan(2000).WithMessage("Số lượng tiểu cầu không hợp lệ.");

        // ===== Thành phần bạch cầu (%) =====
        RuleFor(x => x.Neutrophil)
            .InclusiveBetween(0, 100).WithMessage("Neutrophil phải nằm trong khoảng 0 - 100%.");

        RuleFor(x => x.Eosinophil)
            .InclusiveBetween(0, 100).WithMessage("Eosinophil phải nằm trong khoảng 0 - 100%.");

        RuleFor(x => x.Basophil)
            .InclusiveBetween(0, 100).WithMessage("Basophil phải nằm trong khoảng 0 - 100%.");

        RuleFor(x => x.Monocyte)
            .InclusiveBetween(0, 100).WithMessage("Monocyte phải nằm trong khoảng 0 - 100%.");

        RuleFor(x => x.Lymphocyte)
            .InclusiveBetween(0, 100).WithMessage("Lymphocyte phải nằm trong khoảng 0 - 100%.");

        // Tổng % bạch cầu không vượt quá 100 (nếu có nhập)
        RuleFor(x => x)
            .Must(x =>
            {
                var values = new float?[]
                {
                    x.Neutrophil, x.Eosinophil, x.Basophil, x.Monocyte, x.Lymphocyte
                };

                var sum = values.Where(v => v.HasValue).Sum(v => v!.Value);
                return sum <= 100;
            })
            .WithMessage("Tổng tỷ lệ các loại bạch cầu không được vượt quá 100%.");

        // ===== Text fields =====
        RuleFor(x => x.NucleatedRedBloodCell)
            .MaximumLength(500).WithMessage("Hồng cầu có nhân không được vượt quá 500 ký tự.");

        RuleFor(x => x.AbnormalCells)
            .MaximumLength(1000).WithMessage("Tế bào bất thường không được vượt quá 1000 ký tự.");

        RuleFor(x => x.MalariaParasite)
            .MaximumLength(500).WithMessage("Ký sinh trùng sốt rét không được vượt quá 500 ký tự.");

        // ===== ESR =====
        RuleFor(x => x.Esr1h)
            .GreaterThanOrEqualTo(0).WithMessage("ESR giờ 1 không hợp lệ.");

        RuleFor(x => x.Esr2h)
            .GreaterThanOrEqualTo(0).WithMessage("ESR giờ 2 không hợp lệ.");

        // ===== Đông máu =====
        RuleFor(x => x.BleedingTime)
            .GreaterThan(0).WithMessage("Thời gian máu chảy phải lớn hơn 0.")
            .LessThan(60).WithMessage("Thời gian máu chảy không hợp lệ.");

        RuleFor(x => x.ClottingTime)
            .GreaterThan(0).WithMessage("Thời gian máu đông phải lớn hơn 0.")
            .LessThan(60).WithMessage("Thời gian máu đông không hợp lệ.");
    }
}