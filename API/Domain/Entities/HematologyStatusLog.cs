using Domain.Enums;

namespace Domain.Entities;

public class HematologyStatusLog
{
    public int Id { get; set; }

    // FK key
    public int HematologyId { get; set; }
    public int UpdatedById { get; set; }

    // Props
    public MedicalStatus Status { get; set; }
    public string? DepartmentName { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation 
    public Hematology Hematology { get; set; } = null!;
    public User UpdatedBy { get; set; } = null!;
}