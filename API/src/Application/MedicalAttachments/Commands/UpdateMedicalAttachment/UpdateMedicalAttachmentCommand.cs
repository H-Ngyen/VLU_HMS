using MediatR;

namespace Application.MedicalAttachments.Commands.UpdateMedicalAttachment;

public class UpdateMedicalAttachmentCommand(string name) : IRequest
{
    public int Id { get; set; }
    public int MedicalRecordId { get; set; }
    public string Name { get; set; } = name;
}