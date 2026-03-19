using Application.MedicalAttachments.Commands.CreateMedicalAttachment;
using Application.MedicalAttachments.Commands.DeleteMedicalAttachment;
using Application.MedicalAttachments.Commands.UpdateMedicalAttachment;
using Application.MedicalAttachments.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AppHost.Controllers;

[ApiController]
[Route("api/medical-records/{recordId}/attachments")]
public class MedicalAttachmentController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAllAttachments(int recordId)
    {
        var attachments = await mediator.Send(new GetAllMedicalAttachmentsQuery(recordId));
        return Ok(attachments);
    }
    
    [HttpPost]
    public async Task<IActionResult> CreateAttachment(int recordId, [FromForm] CreateMedicalAttachmentCommand command)
    {
        command.MedicalRecordId = recordId;
        var attachmentId =  await mediator.Send(command);
        // return CreatedAtAction(nameof);
        return Ok(attachmentId);
    }

    [HttpPut("{attachmentId}")]
    public async Task<IActionResult> UpdateAttachment(int recordId, int attachmentId, UpdateMedicalAttachmentCommand command)
    {
        command.Id = attachmentId;
        command.MedicalRecordId = recordId;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{attachmentId}")]
    public async Task<IActionResult> DeleteAttachment(int recordId, int attachmentId)
    {
        await mediator.Send(new DeleteMedicalAttachmentCommand(attachmentId, recordId));
        return NoContent();
    }
}