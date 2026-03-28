using MediatR;

namespace Application.Hematologies.Commands.CreateHematology;

public class CreateHematologyCommand : IRequest
{
    public int Id { get; set; }
    public int MedicalRecordId { get; set; }
    // public int RequestedById { get; set; }
    public required DateOnly RequestedAt { get; set; }
    public required string RequestDescription { get; set; }
    public required string DepartmentName { get; set; }
}