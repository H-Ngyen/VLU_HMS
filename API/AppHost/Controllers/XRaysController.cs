using Application.XRays.Commands.ChangeStatusXray;
using Application.XRays.Commands.CreateXRays;
using Application.XRays.Commands.DeleteXray;
using Application.XRays.Commands.ImportXray;
using Application.XRays.Commands.ImportXrayCompleted;
using Application.XRays.Commands.UpdateCompleteXray;
using Application.XRays.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AppHost.Controllers;

[ApiController]
[Route("api/medical-records/{recordId:int}/clinicals/x-rays")]
[Authorize]
public class XRaysController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult> AddXRay(int recordId, CreateXRaysCommand command)
    {
        command.MedicalRecordId = recordId;
        await mediator.Send(command);
        return Created();
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    // [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> ChangeStatusXray(int recordId, int id, ChangeStatusXrayCommand command)
    {
        command.MedicalRecordId = recordId;
        command.Id = id;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    // [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteXray(int id)
    {
        await mediator.Send(new DeleteXrayCommand(id));
        return NoContent();
    }

    [HttpPut("{id:int}/complete")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    // [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> UpdateCompletedXray(int recordId, int id, UpdateCompleteXrayCommand command)
    {
        command.MedicalRecordId = recordId;
        command.Id = id;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpPost("import-pdf")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<XRayDto>> ImportPdf(int recordId, [FromForm] ImportXrayCommand command)
    {
        command.MedicalRecordId = recordId;
        var xrayDto = await mediator.Send(command);
        return Ok(xrayDto);
    }

    [HttpPost("import-pdf/completed")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    // [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> ImportPdfCompleted(int recordId, ImportXrayCompletedCommand command)
    {
        command.MedicalRecordId = recordId;
        var id = await mediator.Send(command);
        return Created();
    }
}