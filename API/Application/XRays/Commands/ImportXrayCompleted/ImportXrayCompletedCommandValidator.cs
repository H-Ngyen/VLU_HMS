using Domain.Interfaces;
using FluentValidation;

namespace Application.XRays.Commands.ImportXrayCompleted;

public class ImportXrayCompletedCommandValidator : AbstractValidator<ImportXrayCompletedCommand>
{
    public ImportXrayCompletedCommandValidator(IDateTimeProvider dateTimeProvider)
    {
        var today = DateOnly.FromDateTime(dateTimeProvider.Now);

        RuleFor(dto => dto.RequestDepartmentName)
            .NotEmpty().WithMessage("Tên khoa/phòng không được để trống.")
            .MaximumLength(255).WithMessage("Tên khoa/phòng không được vượt quá 255 ký tự.");

        RuleFor(dto => dto.PerformDepartmentName)
            .NotEmpty().WithMessage("Tên khoa/phòng không được để trống.")
            .MaximumLength(255).WithMessage("Tên khoa/phòng không được vượt quá 255 ký tự.");

        RuleFor(dto => dto.DepartmentOfHealth)
            .MaximumLength(255).WithMessage("Sở y tế không được vượt quá 255 ký tự.");

        RuleFor(dto => dto.HospitalName)
            .MaximumLength(255).WithMessage("Tên bệnh viện không được vượt quá 255 ký tự.");

        RuleFor(dto => dto.FormNumber)
            .MaximumLength(50).WithMessage("Mẫu số không được vượt quá 50 ký tự.");

        RuleFor(dto => dto.RoomNumber)
            .MaximumLength(50).WithMessage("Số buồng không được vượt quá 50 ký tự.");

        RuleFor(dto => dto.BedNumber)
            .MaximumLength(50).WithMessage("Số giường không được vượt quá 50 ký tự.");


        RuleFor(dto => dto.RequestDescription)
            .NotEmpty().WithMessage("Nội dung yêu cầu không được để trống.")
            .MaximumLength(1000).WithMessage("Nội dung yêu cầu không được vượt quá 1000 ký tự.");

        RuleFor(dto => dto.RequestedAt)
            .LessThanOrEqualTo(today).WithMessage("Ngày yêu cầu không được lớn hơn ngày hiện tại.")
            .GreaterThan(today.AddYears(-150)).WithMessage("Ngày yêu cầu nhập bị sai.");

        RuleFor(x => x.ResultDescription)
            // .NotEmpty().WithMessage("Kết quả chẩn đoán không được để trống.")
            .MaximumLength(4000).WithMessage("Kết quả chẩn đoán không được vượt quá 4000 ký tự.");

        RuleFor(x => x.DoctorAdvice)
            .MaximumLength(2000).WithMessage("Lời dặn bác sĩ không được vượt quá 2000 ký tự.");

        RuleFor(x => x.CompletedAt)
            .LessThanOrEqualTo(today).WithMessage("Ngày hoàn thành không được lớn hơn ngày hiện tại.");
    }
}