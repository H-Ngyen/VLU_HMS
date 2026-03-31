using Application.Users.Commands.ChangeRole;
using Application.Users.Commands.ChangeStatusActive;
using Application.Users.Commands.CreateCurrentUser;
using Application.Users.Dtos;
using Application.Users.Queries.GetAllUser;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AppHost.Controllers;

[ApiController]
[Route("api/identities")]
public class IdentitiesController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    // [ProducesResponseType(StatusCodes.Status400BadRequest)]
    // [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<int>> CreateCurrentUser(CreateCurrentUserCommand command)
    {
        var (id, isNew) = await mediator.Send(command);
        if (!isNew)
            return Ok();
        return Created("", id);
    }

    [HttpGet("users")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<UserDto>?>> GetAll()
    {
        var usersDto = await mediator.Send(new GetAllUserQuery());
        return Ok(usersDto);
    }
    
    [HttpPut("users/{userId:int}/active")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> ChangeActiveStatus(int userId, ChangeStatusActiveCommand command)
    {
        command.Id = userId;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpPut("users/{userId:int}/roles")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> ChangeRole(int userId, ChangeRoleUserCommand command)
    {
        command.Id = userId;
        await mediator.Send(command);
        return NoContent();
    }
}