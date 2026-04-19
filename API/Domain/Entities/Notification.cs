using Domain.Enums;

namespace Domain.Entities;

public class Notification
{
    // primary key
    public int Id { get; set; }

    // prop
    // in-app notification
    public required string AppTitle { get; set; }
    public required string AppContent { get; set; }

    // email notification
    public required string EmailTitle { get; set; }
    public required string EmailContent { get; set; }

    public required NotificationType Type { get; set; }
    public int ResourceId { get; set; }

    public required DateTime CreatedAt { get; set; }

    // navigation
    public ICollection<UserNotification> UserNotifications { get; set; } = [];

    public static string? NotificationTypeMapperToString(NotificationType type)
    {
        return type switch
        {
            NotificationType.XrayInitial => "XRAY_INITIAL",
            NotificationType.XrayReceived => "XRAY_RECEIVED",
            NotificationType.XrayProcessing => "XRAY_PROCESSING",
            NotificationType.XrayCompleted => "XRAY_COMPLETED",

            NotificationType.HematologyInitial => "HEMATOLOGY_INITIAL",
            NotificationType.HematologyReceived => "HEMATOLOGY_RECEIVED",
            NotificationType.HematologyProcessing => "HEMATOLOGY_PROCESSING",
            NotificationType.HematologyCompleted => "HEMATOLOGY_COMPLETED",

            _ => null
        };
    }
}