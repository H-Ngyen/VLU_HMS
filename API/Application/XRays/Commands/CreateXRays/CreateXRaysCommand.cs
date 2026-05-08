using MediatR;

namespace Application.XRays.Commands.CreateXRays;

public class CreateXRaysCommand : IRequest
{
    // Foreign Key
    // Liên kết với Hồ sơ bệnh án
    public int MedicalRecordId { get; set; }
    // public required int RequestedById { get; set; }
    // public required string DepartmentName { get; set; }
    // Props
    public required string DepartmentOfHealth { get; set; }
    public required string HospitalName { get; set; }
    public required string FormNumber { get; set; }
    public required string RoomNumber { get; set; }
    // public required string BedNumber { get; set; }

    // --- Phần Yêu cầu (Request) ---
    public required string RequestDescription { get; set; }
    public required DateOnly RequestedAt { get; set; }
    public required IEnumerable<int> ListDepartmentId { get; set; }
    public required IEnumerable<int>? AdditionalUserIds { get; set; }
}