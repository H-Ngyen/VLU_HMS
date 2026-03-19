using Application.Patients.Commands.CreatePatient;
using Application.Patients.Commands.DeletePatient;
using Application.Patients.Commands.UpdatePatient;
using Application.Patients.Queries.GetAllPatients;
using Application.Patients.Queries.GetPatientById;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AppHost.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController(IMediator mediator) : ControllerBase
{
    [HttpGet] 
    public async Task<IActionResult> GetAllPatients([FromQuery] GetAllPatientsQuery query)
    {
        var patients = await mediator.Send(query);
        return Ok(patients);
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPatientById([FromRoute] int id)
    {
        var patient = await mediator.Send(new GetPatientByIdQuery(id));
        return Ok(patient);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePatient(CreatePatientCommand command)
    {
        var patientId = await mediator.Send(command);
        return CreatedAtAction(nameof(GetPatientById), new { id = patientId }, patientId);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePatient(int id, UpdatePatientCommand command)
    {
        command.Id = id;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePatient(int id)
    {
        await mediator.Send(new DeletePatientCommand(id));
        return NoContent();
    }
}