using Application.MedicalAttachments.Commands.CreateMedicalAttachment;
using Application.MedicalAttachments.Commands.DeleteMedicalAttachment;
using Application.MedicalAttachments.Commands.UpdateMedicalAttachment;
using Application.MedicalAttachments.Dtos;
using Application.MedicalAttachments.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AppHost.Controllers;

[ApiController]
[Route("api/medical-records/{recordId}/attachments")]
[Authorize]
public class MedicalAttachmentController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<MedicalAttachmentDto>>> GetAllAttachments(int recordId)
    {
        var attachments = await mediator.Send(new GetAllMedicalAttachmentsQuery(recordId));
        return Ok(attachments);
    }
    
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<int>> CreateAttachment(int recordId, [FromForm] CreateMedicalAttachmentCommand command)
    {
        command.MedicalRecordId = recordId;
        var attachmentId =  await mediator.Send(command);
        return Ok(attachmentId);
    }

    [HttpPut("{attachmentId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateAttachment(int recordId, int attachmentId, UpdateMedicalAttachmentCommand command)
    {
        command.Id = attachmentId;
        command.MedicalRecordId = recordId;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{attachmentId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteAttachment(int recordId, int attachmentId)
    {
        await mediator.Send(new DeleteMedicalAttachmentCommand(attachmentId, recordId));
        return NoContent();
    }
}