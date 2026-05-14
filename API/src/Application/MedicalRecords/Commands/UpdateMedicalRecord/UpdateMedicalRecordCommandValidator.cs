using FluentValidation;

namespace Application.MedicalRecords.Commands.UpdateMedicalRecord;

public class UpdateMedicalRecordCommandValidator : AbstractValidator<UpdateMedicalRecordCommand>
{
    public UpdateMedicalRecordCommandValidator()
    {
        RuleFor(dto => dto.AdmissionCount)
            .Must(s => int.TryParse(s, out int value) && value >= 0)
            .When(x => !string.IsNullOrEmpty(x.AdmissionCount))
            .WithMessage("Số lần nhập viện phải là số nguyên không âm (>= 0).");

        RuleFor(dto => dto.TotalTreatmentDays)
            .Must(s => int.TryParse(s, out int value) && value >= 0)
            .When(x => !string.IsNullOrEmpty(x.AdmissionCount))
            .WithMessage("Số ngày điều trị phải là số nguyên không âm (>= 0).");
    }
}