using Domain.Enums;

namespace Domain.Entities;

public class DepartmentTransfer
{
    // Primary Key
    public int Id { get; set; }
    // Foreign Key
    public required int MedicalRecordId { get; set; }

    // Props
    public string? Name { get; set; }
    public DateTime? AdmissionTime { get; set; }
    public TransferType? TransferType { get; set; }
    public string? TreatmentDays { get; set; }

    // Navigation Property
    public MedicalRecord MedicalRecord { get; set; } = null!;
}