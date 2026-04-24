namespace Domain.Constants;

public static class QueueKeys
{
    public static string KeyEmail(int notificationId, int userId) => $"email:{notificationId}:{userId}";
}