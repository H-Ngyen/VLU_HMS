using Application.Common;
using Application.Patients.Dtos;
using AutoMapper;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Patients.Queries.GetAllPatients;

public class GetAllPatientsQueryHandler(ILogger<GetAllPatientsQueryHandler> logger,
    IPatientsRepository patientsRepository,
    IMapper mapper) : IRequestHandler<GetAllPatientsQuery, PagedResult<PatientDto>>
{
    public async Task<PagedResult<PatientDto>> Handle(GetAllPatientsQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting all patients.");
        var (patients, totalCount) = await patientsRepository.GetAllMatchingAsync(request.SearchPhrase,
            request.PageSize,
            request.PageNumber);

        var patientsDto = mapper.Map<IEnumerable<PatientDto>>(patients);
        var result = new PagedResult<PatientDto>(patientsDto, totalCount, request.PageSize, request.PageNumber);
        return result;
    }
}