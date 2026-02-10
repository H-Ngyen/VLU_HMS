using Application.Patients.Dtos;
using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
namespace Application.Patients.Queries.GetPatientById;

public class GetPatientByIdQueryHandler(ILogger<GetPatientByIdQuery> logger,
    IMapper mapper,
    IPatientsRepository patientsRepository) : IRequestHandler<GetPatientByIdQuery, PatientDto>
{
    public async Task<PatientDto> Handle(GetPatientByIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling GetPatientByIdQuery for patient with ID: {PatientId}", request.Id);
        var patient = await patientsRepository.GetByIdAsync(request.Id) 
            ?? throw new NotFoundException(nameof(Patient), request.Id.ToString());
        var patientDto = mapper.Map<PatientDto>(patient);
        return patientDto;
    }
}