using Domain.Enums;

namespace Application.Notifications.Dtos;

public class NotificationDto
{
    public int Id { get; set; }

    // prop
    // in-app notification
    public required string AppTitle { get; set; }
    public required string AppContent { get; set; }

    // email notification
    // public required string EmailTitle { get; set; }
    // public required string EmailContent { get; set; }

    public required NotificationType Type { get; set; }
    public int ResourceId { get; set; }
    public string ResourceUrl { get; set; } = null!;
    public required DateTime CreatedAt { get; set; }

    // navigation
    public ICollection<UserNotificationDto> UserNotifications { get; set; } = [];
}