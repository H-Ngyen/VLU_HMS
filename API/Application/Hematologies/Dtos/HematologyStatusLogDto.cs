using Domain.Constants;

namespace Application.Hematologies.Dtos;

public class HematologyStatusLogDto
{
    public int Id { get; set; }

    // FK key
    public int HematologyId { get; set; }
    public int UpdatedById { get; set; }
    public string? UpdatedByName { get; set; }
    // Props
    public MedicalStatus Status { get; set; }
    public required string DepartmentName { get; set; }
    public DateTime CreatedAt { get; set; }
}