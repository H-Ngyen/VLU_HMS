using Application.XRays.CreateXRays;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AppHost.Controllers;

[ApiController]
[Route("api/medical-records/{recordId}/clinicals/x-rays")]
public class XRaysController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> AddXRay(int recordId, CreateXRaysCommand command)
    {
        command.MedicalRecordId = recordId;
        var xRayId = await mediator.Send(command);
        return Ok(xRayId);
    }
}