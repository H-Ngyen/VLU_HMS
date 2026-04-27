using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Patients.Commands.UpdatePatient;

public class UpdatePatientCommandHandler(ILogger<UpdatePatientCommandHandler> logger,
    IMapper mapper,
    IPatientAuthorizationService patientAuthorizationService,
    IPatientsRepository patientsRepository) : IRequestHandler<UpdatePatientCommand>
{
    public async Task Handle(UpdatePatientCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Updating patient with id: {@PatientId}", request.Id);

        var patient = await patientsRepository.GetByIdAsync(request.Id) 
            ?? throw new NotFoundException(nameof(Patient), request.Id.ToString());

        var isDuplicateHealthInsuranceNumber = patient.HealthInsuranceNumber != request.HealthInsuranceNumber 
            ? await patientsRepository.ExistHealthInsuranceNumber(request.HealthInsuranceNumber)
            : false;
        if (isDuplicateHealthInsuranceNumber && patient.HealthInsuranceNumber != request.HealthInsuranceNumber)
            throw new ConflictException(nameof(Patient.HealthInsuranceNumber), request.HealthInsuranceNumber.ToString());

        if(!await patientAuthorizationService.Authorize(ResourceOperation.Update))
            throw new ForbidException();

        mapper.Map(request, patient);
        await patientsRepository.SaveChanges();
    }
}