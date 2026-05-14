using MediatR;

namespace Application.MedicalAttachments.Commands.DeleteMedicalAttachment;

public class DeleteMedicalAttachmentCommand(int id, int recordId) : IRequest
{
    public int Id { get; set; } = id;
    public int MedicalRecordId { get; set; } = recordId;
}