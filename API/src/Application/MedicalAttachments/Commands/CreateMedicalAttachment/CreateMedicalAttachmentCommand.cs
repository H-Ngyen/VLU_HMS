using MediatR;
using Microsoft.AspNetCore.Http;

namespace Application.MedicalAttachments.Commands.CreateMedicalAttachment;

public class CreateMedicalAttachmentCommand : IRequest<int>
{
    public int MedicalRecordId { get; set; }
    public required string Name { get; set; }
    public required IFormFile File { get; set; }
}