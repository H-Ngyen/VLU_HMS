using Domain.Constants;
using MediatR;

namespace Application.Hematologies.Commands.ChangeStatusHematology;

public class ChangeStatusHematologyCommand : IRequest
{
    public int MedicalRecordId { get; set; }
    public int Id { get; set; }
    public MedicalStatus Status { get; set; }
    public required string DepartmentName { get; set; }
}