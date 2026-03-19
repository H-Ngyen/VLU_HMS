namespace Domain.Entities;

public class XRay
{
    public int Id { get; set; }
    
    // Foreign Key
    // Liên kết với Hồ sơ bệnh án
    public int MedicalRecordId { get; set; }
    public int RequestedById { get; set; }
    public int? PerformedById { get; set; }

    // Props
    // --- Phần Yêu cầu (Request) ---
    public required string RequestDescription { get; set; }
    public required DateTime RequestedAt { get; set; }

    // --- Phần Kết quả (Result) ---
    public string? ResultDescription { get; set; }
    public string? DoctorAdvice { get; set; }
    public DateTime? CompletedAt { get; set; }

    // Navigation Properties
    public MedicalRecord MedicalRecord { get; set; } = null!;
    public User? PerformedBy { get; set; } // Bác sĩ chuyên khoa X-Quang
    public User RequestedBy { get; set; } = null!; // Bác sĩ điều trị
}