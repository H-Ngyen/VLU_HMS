using AutoMapper;
using Domain.Constants;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.MedicalAttachments.Queries.GetAllMedicalAttachments;

public class GetAllMedicalAttachmentsQueryHandler(ILogger<GetAllMedicalAttachmentsQueryHandler> logger,
    IMapper mapper,
    IMedicalAttachmentRepository attachmentRepository,
    IMedicalRecordAuthorizationService medicalRecordAuthorizationService,
    IFileStorageService fileStorageService) : IRequestHandler<GetAllMedicalAttachmentsQuery, List<MedicalAttachmentDto>>
{
    public async Task<List<MedicalAttachmentDto>> Handle(GetAllMedicalAttachmentsQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting all medical attachments of record with id: {recordId}", request.RecordId);
        var attachments = await attachmentRepository.GetAllByIdAsync(request.RecordId);

        if (!await medicalRecordAuthorizationService.Authorize(ResourceOperation.Read))
            throw new ForbidException();

        var attachmentDtos = mapper.Map<List<MedicalAttachmentDto>>(attachments);

        foreach (var dto in attachmentDtos)
        {
            dto.Path = await fileStorageService.GetDownloadUrlAsync(dto.Path);
        }

        return attachmentDtos;
    }
}