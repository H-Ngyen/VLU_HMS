namespace Domain.Entities;

public class MedicalAttachment
{
    public int Id { get; set; }
    // Foreign Key
    public int MedicalRecordId { get; set; }

    // Props
    public required string Name { get; set; }
    public required string Path { get; set; }

    // Navigation Property
    public MedicalRecord MedicalRecord { get; set; } = null!;
}