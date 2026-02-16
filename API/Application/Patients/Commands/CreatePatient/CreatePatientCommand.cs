using Domain.Constants;
using MediatR;

namespace Application.Patients.Commands.CreatePatient;

public class CreatePatientCommand : IRequest<int>
{
    public required string Name { get; set; }
    public required DateTime DateOfBirth { get; set; }
    public required Gender Gender { get; set; } // map to Enum
    public required int EthnicityId { get; set; }
    public required string HealthInsuranceNumber { get; set; }
}