using Application.Common;
using Application.MedicalRecords.Commands.CreateMedicalRecord;
using Application.MedicalRecords.Commands.DeleteMedicalRecord;
using Application.MedicalRecords.Commands.ImportMedicalRecord;
using Application.MedicalRecords.Commands.UpdateMedicalRecord;
using Application.MedicalRecords.Dtos;
using Application.MedicalRecords.Queries.GetAllMedicalRecords;
using Application.MedicalRecords.Queries.GetMedicalRecordById;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AppHost.Controllers;

[ApiController]
[Route("api/medical-records")]
public class MedicalRecordsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<MedicalRecordItemDto>>> GetAllMedicalRecords([FromQuery] GetAllMedicalRecordsQuery query)
    {
        var medicalRecords = await mediator.Send(query);
        return Ok(medicalRecords);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MedicalRecordDto>> GetMedicalRecordById(int id)
    {
        var medicalRecord = await mediator.Send(new GetMedicalRecordByIdQuery(id));
        return Ok(medicalRecord);
    }

    [HttpPost("{patientId:int}")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<int>> CreateMedicalRecord(int patientId, CreateMedicalRecordCommand command)
    {
        command.PatientId = patientId;
        var recordId = await mediator.Send(command);
        return CreatedAtAction(nameof(GetMedicalRecordById), new { id = recordId }, recordId);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateMedicalRecord(int id, UpdateMedicalRecordCommand command)
    {
        command.Id = id;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteMedicalRecord(int id)
    {
        await mediator.Send(new DeleteMedicalRecordCommand(id));
        return NoContent();
    }

    [HttpPost("{patientId:int}/import-pdf")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MedicalRecordDto>> ImportPdf(int patientId, [FromForm] ImportMedicalRecordCommand command)
    {
        command.PatientId = patientId;
        var medicalRecordDto = await mediator.Send(command);
        return Ok(medicalRecordDto);
    }
}