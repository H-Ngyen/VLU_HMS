using Domain.Enums;
using MediatR;

namespace Application.XRays.Commands.ImportXrayCompleted;

public class ImportXrayCompletedCommand : IRequest<int>
{
    // public int MyProperty { get; set; }   

    // Foreign Key
    public int MedicalRecordId { get; set; }
    // public int RequestedById { get; set; }
    // public string? RequestedByName { get; set; }
    // public int? PerformedById { get; set; }
    // public string? PerformedByName { get; set; }

    // Props
    // public required MedicalStatus Status { get; set; }
    public required string RequestDepartmentName { get; set; }
    public required string PerformDepartmentName { get; set; }
    public required string DepartmentOfHealth { get; set; }
    public required string HospitalName { get; set; }
    public required string FormNumber { get; set; }
    public required string RoomNumber { get; set; }
    // public required string BedNumber { get; set; }

    // --- Phần Yêu cầu (Request) ---
    public required string RequestDescription { get; set; }
    public required DateOnly RequestedAt { get; set; }

    // --- Phần Kết quả (Result) ---
    public required string ResultDescription { get; set; }
    public required string DoctorAdvice { get; set; }
    public required DateOnly CompletedAt { get; set; }
}