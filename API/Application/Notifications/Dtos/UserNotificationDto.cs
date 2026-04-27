namespace Application.Notifications.Dtos;

public class UserNotificationDto
{
    public int Id { get; set; }
    // FK
    // public int UserId { get; set; }
    public int NotificationId { get; set; }

    // Props
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }

    // public bool IsEmailSend { get; set; }
    // public DateTime? EmailSentAt { get; set; }

    // Navigation
    // public UserDto User { get; set; } = null!;
    public NotificationDto Notification { get; set; } = null!;
}