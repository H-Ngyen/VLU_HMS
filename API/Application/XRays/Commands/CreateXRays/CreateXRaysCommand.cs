using MediatR;

namespace Application.XRays.Commands.CreateXRays;

public class CreateXRaysCommand : IRequest
{
    // Foreign Key
    // Liên kết với Hồ sơ bệnh án
    public int MedicalRecordId { get; set; }
    // public required int RequestedById { get; set; }
    public required string DepartmentName { get; set; }
    // Props
    // --- Phần Yêu cầu (Request) ---
    public required string RequestDescription { get; set; }
    public required DateOnly RequestedAt { get; set; }
}