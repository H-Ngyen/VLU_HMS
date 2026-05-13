using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.MedicalRecords.Commands.UpdateMedicalRecord;

public class UpdateMedicalRecordCommandHandler(ILogger<UpdateMedicalRecordCommandHandler> logger,
    IMedicalRecordsRepository recordsRepository,
    IMedicalRecordAuthorizationService medicalRecordAuthorizationService,
    IMapper mapper) : IRequestHandler<UpdateMedicalRecordCommand>
{
    public async Task Handle(UpdateMedicalRecordCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Updating record with id: {recordId}", request.Id);
        var record = await recordsRepository.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(MedicalRecord), request.Id.ToString());

        if (!await medicalRecordAuthorizationService.Authorize(ResourceOperation.Update))
            throw new ForbidException();

        mapper.Map(request, record);
        await recordsRepository.SaveChanges();
    }
}