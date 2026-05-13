using Domain.Interfaces;
using FluentValidation;

namespace Application.Patients.Commands.CreatePatient;

public class CreatePatientCommandValidator : AbstractValidator<CreatePatientCommand>
{
    public CreatePatientCommandValidator(IDateTimeProvider dateTimeProvider)
    {
        var today = dateTimeProvider.Now;

        RuleFor(dto => dto.Name)
            .MaximumLength(100).WithMessage("Tên bệnh nhân không được dài quá 100 ký tự.")
            .Matches(@"^[\p{Lu}\s]+$").WithMessage("Tên phải viết IN HOA và không chứa ký tự đặc biệt.");

        RuleFor(dto => dto.DateOfBirth)
            .LessThan(today).WithMessage("Ngày sinh không được lớn hơn ngày hiện tại.")
            .GreaterThan(today.AddYears(-150)).WithMessage("Ngày sinh nhập bị sai.");

        RuleFor(dto => dto.HealthInsuranceNumber)
            .Length(15).WithMessage("Số BHYT phải có đúng 15 ký tự.")
            .Matches(@"^[A-Z]{2}\d{13}$").WithMessage("Số BHYT không đúng định dạng.");

        RuleFor(dto => dto.EthnicityId)
            .GreaterThan(0).WithMessage("Dân tộc không hợp lệ.")
            .LessThanOrEqualTo(56).WithMessage("Dân tộc không hợp lệ.");
    }
}