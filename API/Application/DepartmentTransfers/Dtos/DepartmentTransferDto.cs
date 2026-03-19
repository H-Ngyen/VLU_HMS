using Domain.Constants;

namespace Application.DepartmentTransfers.Dtos;

public class DepartmentTransferDto
{
    public required string Name { get; set; }
    public required DateTime AdmissionTime { get; set; }
    public required TransferType TransferType { get; set; }
    public required string TreatmentDays { get; set; }
}