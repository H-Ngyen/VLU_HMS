namespace Domain.Entities;

public class UserNotification
{
    // PK
    public int Id { get; set; }
    // FK
    public int UserId { get; set; }
    public int NotificationId { get; set; }

    // Props
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }

    public bool IsEmailSend { get; set; }
    public DateTime? EmailSentAt { get; set; }

    // Navigation
    public User User { get; set; } = null!;
    public Notification Notification { get; set; } = null!;
}