using MediatR;

namespace Application.XRays.CreateXRays;

public class CreateXRaysCommand : IRequest<int>
{
    // Foreign Key
    // Liên kết với Hồ sơ bệnh án
    public int MedicalRecordId { get; set; }
    public int RequestedById { get; set; }
    public int PerformedById { get; set; }

    // Props
    // --- Phần Yêu cầu (Request) ---
    public required string RequestDescription { get; set; }
    public required DateTime RequestedAt { get; set; }

    // --- Phần Kết quả (Result) ---
    public string? ResultDescription { get; set; }
    public string? DoctorAdvice { get; set; }
    public DateTime? CompletedAt { get; set; }
}