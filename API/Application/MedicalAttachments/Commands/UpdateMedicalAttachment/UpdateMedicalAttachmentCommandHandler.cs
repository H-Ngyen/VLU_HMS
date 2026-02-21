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
            ?? throw new NotFoundException(nameof(Domain.Entities.MedicalAttachment), request.Id.ToString());
        attachment.Name = request.Name;
        await attachmentRepository.SaveChanges();
    }
}