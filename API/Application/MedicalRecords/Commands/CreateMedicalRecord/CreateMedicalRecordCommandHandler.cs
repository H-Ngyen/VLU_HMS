using Application.Users;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.MedicalRecords.Commands.CreateMedicalRecord;

public class CreateMedicalRecordCommandHandler(ILogger<CreateMedicalRecordCommandHandler> logger,
    IUserContext userContext,
    IMedicalRecordAuthorizationService medicalRecordAuthorizationService,
    IMapper mapper,
    IMedicalRecordsRepository medicalRecordsRepository,
    IGenerateIdService generateIdService,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<CreateMedicalRecordCommand, int>
{
    public async Task<int> Handle(CreateMedicalRecordCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating new medical record");
        
        var user = await userContext.GetCurrentUser();
        var creator = user.Id;

        if(!medicalRecordAuthorizationService.Authorize(user, ResourceOperation.Create))
            throw new ForbidException();

        var record = mapper.Map<MedicalRecord>(request);
        record.CreatedBy = creator;
        record.CreatedAt = dateTimeProvider.Now;
        record.StorageCode = await generateIdService.GenerateStorageId();

        var recordId = await medicalRecordsRepository.CreateAsync(record);
        return recordId;
    }
}