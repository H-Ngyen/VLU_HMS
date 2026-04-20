using AutoMapper;
using Domain.Entities;

namespace Application.Notifications.Dtos;

public class NotificationProfile : Profile
{
    public NotificationProfile()
    {
        CreateMap<UserNotification, UserNotificationDto>();
        CreateMap<Notification, NotificationDto>();
    }
}