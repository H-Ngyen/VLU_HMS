using Application.Notifications.Commands.MarkRead;
using Application.Notifications.Dtos;
using Application.Notifications.Queries.GetCurrentUserNotifications;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AppHost.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    // [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<IEnumerable<UserNotificationDto>>> GetCurrentUserNotification()
    {
        var result = await mediator.Send(new GetCurrentUserNotificationsQuery());
        return Ok(result);
    }

    [HttpPut("{userNotificationId:int}/read")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    // [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult> MarkRead(int userNotificationId)
    {
        await mediator.Send(new MarkReadCommand(userNotificationId));
        return NoContent();
    }
}