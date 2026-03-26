using Domain.Constants;
using MediatR;

namespace Application.XRays.Commands.UpdateCompleteXray;

public class UpdateCompleteXrayCommand : IRequest
{
    public int Id { get; set; }
    public int MedicalRecordId { get; set; }
    // public MedicalStatus Status { get; set; }
    // public required string DepartmentName { get; set; }
    
    // --- Phần Kết quả (Result) ---
    public string? ResultDescription { get; set; }
    public string? DoctorAdvice { get; set; }
    public DateOnly? CompletedAt { get; set; }
}