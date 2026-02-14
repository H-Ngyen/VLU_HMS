using MediatR;

namespace Application.MedicalRecords.Commands.UpdateMedicalRecord;

public class UpdateMedicalRecordCommand(int id) : IRequest
{
    public int Id { get; set; } = id;
}