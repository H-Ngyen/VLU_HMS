using Application.MedicalRecords.Commands.CreateMedicalRecord;
using Application.MedicalRecords.Commands.DeleteMedicalRecord;
using Application.MedicalRecords.Commands.UpdateMedicalRecord;
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
    public async Task<IActionResult> GetAllMedicalRecords([FromQuery] GetAllMedicalRecordsQuery query)
    {
        var medicalRecords = await mediator.Send(query);
        return Ok(medicalRecords);
    }   

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetMedicalRecordById(int id)
    {
        var medicalRecord = await mediator.Send(new GetMedicalRecordByIdQuery(id));
        return Ok(medicalRecord);
    }

    [HttpPost("{patientId:int}")]
    public async Task<IActionResult> CreateMedicalRecord(int patientId, CreateMedicalRecordCommand command)
    {
        command.PatientId = patientId;
        var recordId = await mediator.Send(command);
        return CreatedAtAction(nameof(GetMedicalRecordById), new { id = recordId }, recordId);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateMedicalRecord(int id, UpdateMedicalRecordCommand command)
    {
        command.Id = id;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteMedicalRecord(int id)
    {
        await mediator.Send(new DeleteMedicalRecordCommand(id));
        return NoContent();
    }
}