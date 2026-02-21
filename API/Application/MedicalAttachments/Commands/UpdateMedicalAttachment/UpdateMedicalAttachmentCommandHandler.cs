using Domain.Entities;
using Domain.Exceptions;
using Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.MedicalAttachments.Commands.UpdateMedicalAttachment;

public class UpdateMedicalAttachmentCommandHandler(ILogger<UpdateMedicalAttachmentCommandHandler> logger,
    IMedicalAttachmentRepository attachmentRepository) : IRequestHandler<UpdateMedicalAttachmentCommand>
{
    public async Task Handle(UpdateMedicalAttachmentCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling UpdateMedicalAttachmentCommand for Id: {Id}", request.Id);
        var attachment = await attachmentRepository.GetByIdAsync(request.Id)
            ?? throw new NotFoundException(nameof(MedicalAttachment), request.Id.ToString());
        
        if(request.MedicalRecordId != attachment.MedicalRecordId)
            throw new BadRequestException("Tệp đính kèm này không thuộc Hồ sơ Y tế đã được chỉ định.");

        attachment.Name = request.Name;
        await attachmentRepository.SaveChanges();
    }
}