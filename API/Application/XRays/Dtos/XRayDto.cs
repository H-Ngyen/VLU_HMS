using Domain.Enums;

namespace Application.XRays.Dtos;

public class XRayDto
{
    public int Id { get; set; }
    // Foreign Key
    public string? DepartmentOfHealth { get; set; }
    public string? HospitalName { get; set; }
    public string? FormNumber { get; set; }
    public string? RoomNumber { get; set; }
    public string? BedNumber { get; set; }

    public int MedicalRecordId { get; set; }
    public int RequestedById { get; set; }
    public string? RequestedByName { get; set; }
    public int? PerformedById { get; set; }
    public string? PerformedByName { get; set; }

    // Props
    public MedicalStatus? Status { get; set; }

    // --- Phần Yêu cầu (Request) ---
    public string? RequestDescription { get; set; }
    public DateOnly? RequestedAt { get; set; }

    // --- Phần Kết quả (Result) ---
    public string? ResultDescription { get; set; }
    public string? DoctorAdvice { get; set; }
    public DateOnly? CompletedAt { get; set; }

    // Navigation Properties
    public ICollection<XRayStatusLogDto> XRayStatusLogs { get; set; } = [];
}
