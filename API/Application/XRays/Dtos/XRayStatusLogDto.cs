using Domain.Constants;

namespace Application.XRays.Dtos;

public class XRayStatusLogDto
{
    public int Id { get; set; }
    public int XRayId { get; set; }
    public int UpdatedById { get; set; }
    public string? UpdatedByName { get; set; }

    public MedicalStatus Status { get; set; }
    public required string DepartmentName { get; set; }
    public DateTime CreatedAt { get; set; }
}
