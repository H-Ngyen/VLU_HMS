using AutoMapper;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.MedicalAttachments.Queries.GetAllMedicalAttachments;

public class GetAllMedicalAttachmentsQueryHandler(ILogger<GetAllMedicalAttachmentsQueryHandler> logger,
    IMapper mapper,
    IMedicalAttachmentRepository attachmentRepository) : IRequestHandler<GetAllMedicalAttachmentsQuery, List<MedicalAttachmentDto>>
{
    public async Task<List<MedicalAttachmentDto>> Handle(GetAllMedicalAttachmentsQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting all medical attachments of record with id: {recordId}", request.RecordId);
        var attachments = await attachmentRepository.GetAllByIdAsync(request.RecordId);
        var attachmentDtos = mapper.Map<List<MedicalAttachmentDto>>(attachments);
        return attachmentDtos;
    }
}