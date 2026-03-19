using MediatR;

namespace Application.MedicalAttachments.Queries;

public class GetAllMedicalAttachmentsQuery(int id) : IRequest<List<MedicalAttachmentDto>>
{
    public int RecordId { get; set; } = id;
}