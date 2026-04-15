using Domain.Enums;

namespace Domain.Entities;

public class Notification
{
    // primary key
    public int Id { get; set; }
    // foreign key 
    public int UserId { get; set; }
    // prop
    public required string Title { get; set; }
    public required string Message { get; set; }
    public required NotificationType Type { get; set; }
    public required int ReferenceId { get; set; }
    public bool IsRead { get; set; }
    public required DateTime CreatedAt { get; set; }
    public ICollection<User> Users { get; set; } = [];

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