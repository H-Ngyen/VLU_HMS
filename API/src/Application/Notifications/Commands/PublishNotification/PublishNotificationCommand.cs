using Domain.Constants;
using Domain.Enums;
using MediatR;

namespace Application.Notifications.Commands.PublishNotification;

public class PublishNotificationCommand(int resourceId) : IRequest<bool>
{
    public int ResourceId { get; set; } = resourceId;
    public NotificationType NotificattionType { get; set; }
    public ClinicalsType ClinicalType { get; set; }
    public IEnumerable<int> ListUserId { get; set; } = [];
}