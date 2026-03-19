using FluentValidation;

namespace Application.MedicalRecords.Queries.GetAllMedicalRecords;

public class GetAllMedicalRecordsQueryVaidator : AbstractValidator<GetAllMedicalRecordsQuery>
{
    private readonly int[] allowPageSizes = [5, 10, 15, 20, 25, 30, 35, 40];
    public GetAllMedicalRecordsQueryVaidator()
    {
        RuleFor(dto => dto.PageNumber)
            .GreaterThanOrEqualTo(1)
            .WithMessage("Trang số phải lớn hơn hoặc bằng 1");

        RuleFor(dto => dto.PageSize)
            .Must(value => allowPageSizes.Contains(value))
            .WithMessage($"Kích thước trang phải ở mức [{string.Join(", ", allowPageSizes)}]");

        RuleFor(dto => dto.RecordType)
            .IsInEnum()
            .WithMessage("Loại hồ sơ này không có trong hệ thống");
    }
}