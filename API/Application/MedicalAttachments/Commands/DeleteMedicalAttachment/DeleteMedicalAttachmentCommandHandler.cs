using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.MedicalAttachments.Commands.DeleteMedicalAttachment;

public class DeleteMedicalAttachmentCommandHandler(ILogger<DeleteMedicalAttachmentCommandHandler> logger,
    IMedicalAttachmentRepository attachmentRepository,
    IFileStorageService objService) : IRequestHandler<DeleteMedicalAttachmentCommand>
{
    public async Task Handle(DeleteMedicalAttachmentCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Deleting attachment with id: {attachmentId}", request.Id);
        var attachment = await attachmentRepository.GetByIdAsync(request.Id) 
            ?? throw new NotFoundException(nameof(MedicalAttachment), request.Id.ToString());

        if(attachment.MedicalRecordId != request.MedicalRecordId)
            throw new BadRequestException("Tệp đính kèm này không thuộc Hồ sơ Y tế đã được chỉ định.");

        await objService.DeleteFileAsync(attachment.Path);
        await attachmentRepository.DeleteAsync(attachment);
    }
}