using Application.Statistics.Queries.GetDashboard;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AppHost.Controllers;

[ApiController]
[Route("api/statistics")]
[Authorize]
public class StatisticsController(IMediator mediator) : ControllerBase
{
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard([FromQuery] GetDashboardQuery query)
    {
        var result = await mediator.Send(query);
        return Ok(result);
    }
}