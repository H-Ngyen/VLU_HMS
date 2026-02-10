using AutoMapper;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Patients.Commands.CreatePatient;

public class CreatePatientCommandHandler(ILogger<CreatePatientCommandHandler> logger,
    IMapper mapper,
    IUserRepository userRepository,
    IEthnicityRepository ethnicityRepository,
    IPatientsRepository patientsRepository,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<CreatePatientCommand, int>
{
    public async Task<int> Handle(CreatePatientCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating a new patient.");
        
        var CreatorId = 1; // để tạm, not for production

        var isExistCreator = await userRepository.ExistsAsync(CreatorId);
        if(!isExistCreator) 
            throw new BadRequestException($"Creator with id: {CreatorId} does not exist."); 

        var ethnicityExist = await ethnicityRepository.ExistsAsync(request.EthnicityId);        
        if (!ethnicityExist)
            throw new BadRequestException($"Ethnicity with id {request.EthnicityId} does not exist.");

        var isDuplicateHealthInsuranceNumber = await patientsRepository.ExistHealthInsuranceNumber(request.HealthInsuranceNumber);
        if (isDuplicateHealthInsuranceNumber)
            throw new ConflictException(nameof(Patient.HealthInsuranceNumber),
                request.HealthInsuranceNumber.ToString());

        var newPatient = mapper.Map<Patient>(request);
        newPatient.CreatedBy = CreatorId;
        newPatient.CreatedAt = dateTimeProvider.Now;
        
        var patientId = await patientsRepository.CreateAsync(newPatient);
        return patientId;
    }
}