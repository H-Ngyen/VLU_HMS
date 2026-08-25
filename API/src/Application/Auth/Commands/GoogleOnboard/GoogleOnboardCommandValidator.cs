using FluentValidation;

namespace Application.Auth.Commands.GoogleOnboard;

public class GoogleOnboardCommandValidator : AbstractValidator<GoogleOnboardCommand>
{
    public GoogleOnboardCommandValidator()
    {
        RuleFor(v => v.IdToken)
            .NotEmpty().WithMessage("IdToken is required.");

        RuleFor(v => v.HealthInsuranceNumber)
            .NotEmpty().WithMessage("HealthInsuranceNumber is required.");

        RuleFor(v => v.DateOfBirth)
            .NotEmpty().WithMessage("DateOfBirth is required.");
            
        RuleFor(v => v.EthnicityId)
            .GreaterThan(0).WithMessage("EthnicityId must be greater than 0.");
    }
}
