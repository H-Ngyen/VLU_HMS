using Domain.Enums;

namespace Domain.Entities;

public class Patient
{
    public int Id { get; set; }
    
    // Foreign Keys
    public required int EthnicityId { get; set; }
    public required int CreatedBy { get; set; }

    // Props
    public required string Name { get; set; }
    public required DateTime DateOfBirth { get; set; }
    public required Gender Gender { get; set; } // map to Enum 
    public required string HealthInsuranceNumber { get; set; }
    public required DateTime CreatedAt { get; set; }

    // Navigation Properties
    public User Creator { get; set; } = null!;
    public Ethnicity Ethnicity { get; set; } = null!;
    public ICollection<MedicalRecord> MedicalRecords { get; set; } = [];
}