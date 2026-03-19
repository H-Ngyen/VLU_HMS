using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.MedicalRecords.Commands.CreateMedicalRecord;

public class CreateMedicalRecordCommandHandler(ILogger<CreateMedicalRecordCommandHandler> logger,
    IMapper mapper,
    IMedicalRecordsRepository medicalRecordsRepository,
    IGenerateIdService generateIdService,
    IDateTimeProvider dateTimeProvider) : IRequestHandler<CreateMedicalRecordCommand, int>
{
    public async Task<int> Handle(CreateMedicalRecordCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating new medical record");
        var creator = 1; // để tạm thời, not for production

        var record = mapper.Map<MedicalRecord>(request);
        record.CreatedBy = creator;
        record.CreatedAt = dateTimeProvider.Now;
        record.StorageCode = await generateIdService.GenerateStorageId();

        var recordId = await medicalRecordsRepository.CreateAsync(record);
        return recordId;
    }
}