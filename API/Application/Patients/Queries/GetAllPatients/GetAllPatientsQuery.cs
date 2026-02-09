using Application.Common;
using Application.Patients.Dtos;
using Domain.Constants;
using MediatR;
namespace Application.Patients.Queries.GetAllPatients;

public class GetAllPatientsQuery : IRequest<PagedResult<PatientDto>>
{
    public string? SearchPhrase { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}