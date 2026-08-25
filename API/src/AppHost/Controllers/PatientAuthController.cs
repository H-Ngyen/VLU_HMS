using Application.Auth.Commands.GoogleLogin;
using Application.Auth.Commands.GoogleOnboard;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AppHost.Controllers;

[ApiController]
[Route("api/auth/patient")]
[AllowAnonymous] // Anyone can login/onboard
public class PatientAuthController(IMediator mediator) : ControllerBase
{
    [HttpPost("google-login")]
    public async Task<ActionResult<GoogleLoginResponse>> GoogleLogin(GoogleLoginCommand command)
    {
        var response = await mediator.Send(command);
        return Ok(response);
    }

    [HttpPost("google-onboard")]
    public async Task<ActionResult<GoogleOnboardResponse>> GoogleOnboard(GoogleOnboardCommand command)
    {
        var response = await mediator.Send(command);
        return Ok(response);
    }
}
