using Application.MedicalAttachments.Commands.CreateMedicalAttachment;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AppHost.Controllers;

[ApiController]
[Route("api/medical-records/{recordId}/attachments")]
public class MedicalAttachmentController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateAttachment(int recordId, [FromForm] CreateMedicalAttachmentCommand command)
    {
        command.MedicalRecordId = recordId;
        var attachmentId =  await mediator.Send(command);
        // return CreatedAtAction(nameof);
        return Ok(attachmentId);
    }
}