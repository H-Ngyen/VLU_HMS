using Domain.Enums;

namespace Domain.Entities;

public class XRayStatusLog
{
    public int Id { get; set; }

    // FK key
    public int XRayId { get; set; }          
    public int UpdatedById { get; set; }

    // Props
    public MedicalStatus Status { get; set; }
    public required string DepartmentName { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation 
    public XRay XRay { get; set; } = null!;
    public User UpdatedBy { get; set; } = null!;
}