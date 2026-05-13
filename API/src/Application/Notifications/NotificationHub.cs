using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Application.Notifications;

[Authorize]
public class NotificationHub(ILogger<NotificationHub> logger) : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        logger.LogInformation("Client connected to NotificationHub. UserIdentifier: {UserId}, ConnectionId: {ConnectionId}", 
            userId, Context.ConnectionId);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.UserIdentifier;
        if (exception != null)
        {
            logger.LogError(exception, "Client disconnected from NotificationHub with error. UserIdentifier: {UserId}, ConnectionId: {ConnectionId}", 
                userId, Context.ConnectionId);
        }
        else
        {
            logger.LogInformation("Client disconnected from NotificationHub. UserIdentifier: {UserId}, ConnectionId: {ConnectionId}", 
                userId, Context.ConnectionId);
        }
        await base.OnDisconnectedAsync(exception);
    }
}