using Domain.Enums;
using MediatR;

namespace Application.Auth.Commands.GoogleOnboard;

public class GoogleOnboardResponse
{
    public required string Token { get; set; }
    public required int UserId { get; set; }
}

public class GoogleOnboardCommand : IRequest<GoogleOnboardResponse>
{
    public required string IdToken { get; set; }
    public required string HealthInsuranceNumber { get; set; }
    public required DateTime DateOfBirth { get; set; }
    public required Gender Gender { get; set; }
    public required int EthnicityId { get; set; }
}
