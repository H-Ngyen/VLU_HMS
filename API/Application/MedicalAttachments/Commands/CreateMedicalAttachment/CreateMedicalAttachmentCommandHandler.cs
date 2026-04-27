using AutoMapper;
using Domain.Repositories;
using MediatR;
using Domain.Entities;
using Microsoft.Extensions.Logging;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Enums;

namespace Application.MedicalAttachments.Commands.CreateMedicalAttachment;

public class CreateMedicalAttachmentCommandHandler(ILogger<CreateMedicalAttachmentCommandHandler> logger,
    IMedicalRecordAuthorizationService medicalRecordAuthorizationService,
    IMapper mapper,
    IMedicalRecordsRepository recordsRepository,
    IFileStorageService fileStorageService,
    IMedicalAttachmentRepository attachmentRepository) : IRequestHandler<CreateMedicalAttachmentCommand, int>
{
    public async Task<int> Handle(CreateMedicalAttachmentCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Creating medical attachment for record with id: {RecordId}", request.MedicalRecordId);

        var recordExist = await recordsRepository.ExistAsync(request.MedicalRecordId);
        if (!recordExist)
            throw new NotFoundException(nameof(MedicalRecord), request.MedicalRecordId.ToString());

        if (!await medicalRecordAuthorizationService.Authorize(ResourceOperation.Create))
            throw new ForbidException();

        var attachment = mapper.Map<MedicalAttachment>(request);
        var file = request.File;
        using var stream = file.OpenReadStream();
        var storedPath = await fileStorageService.UploadFileAsync(stream, file.FileName);
        attachment.Path = storedPath;

        var attachmentId = await attachmentRepository.CreateAsync(attachment);
        return attachmentId;
    }
}