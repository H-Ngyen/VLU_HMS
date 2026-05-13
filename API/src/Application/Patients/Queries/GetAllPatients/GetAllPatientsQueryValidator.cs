using FluentValidation;

namespace Application.Patients.Queries.GetAllPatients;

public class GetAllPatientsQueryValidator : AbstractValidator<GetAllPatientsQuery>
{
    private readonly int[] allowPageSizes = [5, 10, 15, 20, 25, 30, 35, 40];
    public GetAllPatientsQueryValidator()
    {
        RuleFor(dto => dto.PageNumber)
            .GreaterThanOrEqualTo(1)
            .WithMessage("Trang số phải lớn hơn hoặc bằng 1");

        RuleFor(dto => dto.PageSize)
            .Must(value => allowPageSizes.Contains(value))
            .WithMessage($"Kích thước trang phải ở mức [{string.Join(", ", allowPageSizes)}]");
    }
}