using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Application.Notifications;

[Authorize]
public class NotificationHub : Hub
{
    
}