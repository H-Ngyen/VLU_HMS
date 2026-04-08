using Application.Ethnicities.Queries.GetAllEthnicities;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AppHost.Controllers;

[ApiController]
[Route("api/ethinicities")]
public class EthinicitiesController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<Ethnicity>>> GetAll()
    {
        var ethinicities = await mediator.Send(new GetAllEthnicitiesQuery());
        return Ok(ethinicities);
    }
}