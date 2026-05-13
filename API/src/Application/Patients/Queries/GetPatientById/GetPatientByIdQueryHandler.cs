using Application.Patients.Dtos;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
namespace Application.Patients.Queries.GetPatientById;

public class GetPatientByIdQueryHandler(ILogger<GetPatientByIdQuery> logger,
    IMapper mapper,
    IPatientAuthorizationService patientAuthorizationService,
    IPatientsRepository patientsRepository) : IRequestHandler<GetPatientByIdQuery, PatientDto>
{
    public async Task<PatientDto> Handle(GetPatientByIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling GetPatientByIdQuery for patient with ID: {PatientId}", request.Id);
        var patient = await patientsRepository.GetByIdAsync(request.Id) 
            ?? throw new NotFoundException(nameof(Patient), request.Id.ToString());

        if(!await patientAuthorizationService.Authorize(ResourceOperation.Read))
            throw new ForbidException();
            
        var patientDto = mapper.Map<PatientDto>(patient);
        return patientDto;
    }
}