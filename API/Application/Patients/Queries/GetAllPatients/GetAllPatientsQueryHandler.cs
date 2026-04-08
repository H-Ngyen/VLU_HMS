using Application.Common;
using Application.Patients.Dtos;
using AutoMapper;
using Domain.Constants;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Patients.Queries.GetAllPatients;

public class GetAllPatientsQueryHandler(ILogger<GetAllPatientsQueryHandler> logger,
    IPatientsRepository patientsRepository,
    IPatientAuthorizationService patientAuthorizationService,
    IMapper mapper) : IRequestHandler<GetAllPatientsQuery, PagedResult<PatientDto>>
{
    public async Task<PagedResult<PatientDto>> Handle(GetAllPatientsQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting all patients.");
        if(!await patientAuthorizationService.Authorize(ResourceOperation.Read))
            throw new ForbidException();

        var (patients, totalCount) = await patientsRepository.GetAllMatchingAsync(request.SearchPhrase,
            request.PageSize,
            request.PageNumber);

        var patientsDto = mapper.Map<IEnumerable<PatientDto>>(patients);
        var result = new PagedResult<PatientDto>(patientsDto, totalCount, request.PageSize, request.PageNumber);
        return result;
    }
}