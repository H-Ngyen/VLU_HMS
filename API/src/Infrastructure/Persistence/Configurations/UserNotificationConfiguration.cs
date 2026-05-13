using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal class UserNotificationConfiguration : IEntityTypeConfiguration<UserNotification>
{
    public void Configure(EntityTypeBuilder<UserNotification> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.IsRead)
            .HasDefaultValue(false);

        builder.Property(x => x.IsEmailSend)
            .HasDefaultValue(false);

        builder.HasOne(x => x.User)
            .WithMany(x => x.UserNotifications)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Notification)
            .WithMany(x => x.UserNotifications)
            .HasForeignKey(x => x.NotificationId)
            .OnDelete(DeleteBehavior.Cascade);

        // tránh duplicate 1 user nhận cùng notification nhiều lần
        builder.HasIndex(x => new { x.UserId, x.NotificationId })
            .IsUnique();

        // query unread cực nhanh
        builder.HasIndex(x => new { x.UserId, x.IsRead, x.NotificationId });

        // retry email queue
        builder.HasIndex(x => new { x.IsEmailSend, x.NotificationId });
    }
}