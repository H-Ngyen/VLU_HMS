using Domain.Entities;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.MedicalRecords.Commands.DeleteMedicalRecord;

public class DeletePatientCommandHandler(ILogger<DeletePatientCommandHandler> logger,
    IMedicalRecordAuthorizationService medicalRecordAuthorizationService,
    IMedicalRecordsRepository recordsRepository) : IRequestHandler<DeleteMedicalRecordCommand>
{
    public async Task Handle(DeleteMedicalRecordCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting record with id: {recordId}", request.Id);
        var record = await recordsRepository.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(MedicalRecord), request.Id.ToString());
        
        if(!await medicalRecordAuthorizationService.Authorize(ResourceOperation.Delete))
            throw new ForbidException();
            
        await recordsRepository.DeleteAsync(record);
    }
}