using Application.Appointments.Commands.BookAppointment;
using Application.Appointments.Queries.GetMyAppointments;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AppHost.Controllers;

[ApiController]
[Route("api/appointments")]
[Authorize]
public class AppointmentsController(IMediator mediator) : ControllerBase
{
    [HttpPost("book")]
    public async Task<ActionResult<BookAppointmentResponse>> BookAppointment(BookAppointmentCommand command)
    {
        var response = await mediator.Send(command);
        return Ok(response);
    }

    [HttpGet("my-appointments")]
    public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetMyAppointments()
    {
        var response = await mediator.Send(new GetMyAppointmentsQuery());
        return Ok(response);
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult> UpdateAppointmentStatus(int id, [FromBody] Application.Appointments.Commands.UpdateAppointmentStatus.UpdateAppointmentStatusCommand command)
    {
        if (id != command.AppointmentId)
        {
            return BadRequest("AppointmentId in URL does not match body.");
        }

        await mediator.Send(command);
        return NoContent();
    }
}
