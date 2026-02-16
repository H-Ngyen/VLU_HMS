using Domain.Constants;
using MediatR;

namespace Application.Patients.Commands.UpdatePatient;

public class UpdatePatientCommand : IRequest
{
    public int Id { get; set; }
    
    // Foreign Keys
    public required int EthnicityId { get; set; }

    // Props
    public required string Name { get; set; }
    public required DateTime DateOfBirth { get; set; }
    public required Gender Gender { get; set; } // map to Enum 
    public required string HealthInsuranceNumber { get; set; }
    // public required DateTime CreatedAt { get; set; }
}