using Application.XRays.Commands.ChangeStatusXray;
using Application.XRays.Commands.CreateXRays;
using Application.XRays.Commands.UpdateCompleteXray;
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

}