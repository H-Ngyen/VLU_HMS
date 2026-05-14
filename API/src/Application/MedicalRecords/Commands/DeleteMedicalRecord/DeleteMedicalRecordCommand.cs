using System.Data.Common;
using MediatR;

namespace Application.MedicalRecords.Commands.DeleteMedicalRecord;

public class DeleteMedicalRecordCommand(int id) : IRequest
{
    public int Id { get; set; } = id;
}