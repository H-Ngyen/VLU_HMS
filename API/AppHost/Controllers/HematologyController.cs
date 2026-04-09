using Application.Hematologies.Commands.ChangeStatusHematology;
using Application.Hematologies.Commands.CreateHematology;
using Application.Hematologies.Commands.ImportHematology;
using Application.Hematologies.Commands.ImportHematologyCompleted;
using Application.Hematologies.Commands.UpdateCompleteHematology;
using Application.Hematologies.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AppHost.Controllers;

[ApiController]
[Route("api/medical-records/{recordId}/clinicals/hematologies")]
[Authorize]
public class HematologyController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult> CreateHematology(int recordId, CreateHematologyCommand command)
    {
        command.MedicalRecordId = recordId;
        await mediator.Send(command);
        return Created();
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> ChangeStatus(int id, int recordId, ChangeStatusHematologyCommand command)
    {
        command.Id = id;
        command.MedicalRecordId = recordId;
        await mediator.Send(command);
        return NoContent();
    }
    
    [HttpPut("{id:int}/complete")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> UpdateCompleted(int id, int recordId, UpdateCompletedHematologyCommand command)
    {
        command.Id = id;
        command.MedicalRecordId = recordId;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpPost("import-pdf")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<HematologyDto>> ImportPdf(int recordId, [FromForm] ImportHematologyCommand command)
    {
        command.MedicalRecordId = recordId;
        var hematologyDto = await mediator.Send(command);
        return Ok(hematologyDto);
    }

    [HttpPost("import-pdf/completed")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    // [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> ImportPdfCompleted(int recordId, ImportHematologyCompletedCommand command)
    {
        command.MedicalRecordId = recordId;
        var id = await mediator.Send(command);
        return Created();
    }
}