using Application.Patients.Dtos;
using MediatR;

namespace Application.Patients.Queries.GetPatientById;

public class GetPatientByIdQuery(int id) : IRequest<PatientDto>
{
    public int Id { get; } = id;
}