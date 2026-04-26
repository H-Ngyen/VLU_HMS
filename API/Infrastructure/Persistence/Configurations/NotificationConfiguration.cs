using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.AppTitle)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.AppContent)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(x => x.EmailTitle)
            .HasMaxLength(250);

        builder.Property(x => x.EmailContent)
            .IsRequired();

        builder.Property(x => x.Type)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(x => x.ResourceId);

        builder.Property(x => x.ResourceUrl).IsRequired().HasMaxLength(100);

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.HasIndex(x => x.CreatedAt);

        builder.HasMany(x => x.UserNotifications)
            .WithOne(x => x.Notification)
            .HasForeignKey(x => x.NotificationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}