using Application.MedicalRecords.Dtos;
using MediatR;

namespace Application.MedicalRecords.Queries.GetMedicalRecordById;

public class GetMedicalRecordByIdQuery(int id) : IRequest<MedicalRecordDto>
{
    public int Id { get; set; } = id;
}