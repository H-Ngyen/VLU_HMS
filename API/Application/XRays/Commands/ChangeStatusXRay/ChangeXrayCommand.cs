using Domain.Constants;
using MediatR;

namespace Application.XRays.Commands.ChangeStatusXray;

public class ChangeXrayCommand : IRequest
{
    public int MedicalRecordId { get; set; }
    public int Id { get; set; }
    public MedicalStatus Status { get; set; }
    public required string DepartmentName { get; set; }
}