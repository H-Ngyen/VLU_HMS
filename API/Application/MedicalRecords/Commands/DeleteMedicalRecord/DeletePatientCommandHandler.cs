using Domain.Entities;
using Domain.Exceptions;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.MedicalRecords.Commands.DeleteMedicalRecord;

public class DeletePatientCommandHandler(ILogger<DeletePatientCommandHandler> logger,
    IMedicalRecordsRepository recordsRepository) : IRequestHandler<DeleteMedicalRecordCommand>
{
    public async Task Handle(DeleteMedicalRecordCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting record with id: {recordId}", request.Id);
        var record = await recordsRepository.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(MedicalRecord), request.Id.ToString());
        await recordsRepository.DeleteAsync(record);
    }
}