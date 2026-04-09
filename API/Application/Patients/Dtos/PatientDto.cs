using Domain.Entities;
using Domain.Enums;

namespace Application.Patients.Dtos;

public class PatientDto
{
    public int Id { get; set; }
    
    // Foreign Keys
    public required int EthnicityId { get; set; }
    
    // Props
    public required string Name { get; set; }
    public required DateTime DateOfBirth { get; set; }
    public required Gender Gender { get; set; } // map to Enum 
    public required string HealthInsuranceNumber { get; set; }

    // Navigation Properties
    public Ethnicity Ethnicity { get; set; } = null!;
}