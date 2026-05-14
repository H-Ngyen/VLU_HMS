using Domain.Enums;
using MediatR;

namespace Application.XRays.Commands.ChangeStatusXray;

public class ChangeStatusXrayCommand : IRequest
{
    public int MedicalRecordId { get; set; }
    public int Id { get; set; }
    public MedicalStatus Status { get; set; }
    // public required string DepartmentName { get; set; }
}