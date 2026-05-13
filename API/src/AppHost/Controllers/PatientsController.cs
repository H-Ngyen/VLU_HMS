using Application.Common;
using Application.Patients.Commands.CreatePatient;
using Application.Patients.Commands.DeletePatient;
using Application.Patients.Commands.UpdatePatient;
using Application.Patients.Dtos;
using Application.Patients.Queries.GetAllPatients;
using Application.Patients.Queries.GetPatientById;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AppHost.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PatientsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<PatientDto>>> GetAllPatients([FromQuery] GetAllPatientsQuery query)
    {
        var patients = await mediator.Send(query);
        return Ok(patients);
    }
    
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PatientDto>> GetPatientById([FromRoute] int id)
    {
        var patient = await mediator.Send(new GetPatientByIdQuery(id));
        return Ok(patient);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<int>> CreatePatient(CreatePatientCommand command)
    {
        var patientId = await mediator.Send(command);
        return CreatedAtAction(nameof(GetPatientById), new { id = patientId }, patientId);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdatePatient(int id, UpdatePatientCommand command)
    {
        command.Id = id;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeletePatient(int id)
    {
        await mediator.Send(new DeletePatientCommand(id));
        return NoContent();
    }
}