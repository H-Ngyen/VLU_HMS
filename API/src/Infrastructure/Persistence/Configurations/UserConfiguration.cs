using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal class UserConfiguration : IEntityTypeConfiguration<User>
{
       public void Configure(EntityTypeBuilder<User> builder)
       {
              builder.HasKey(u => u.Id);

              builder.HasIndex(u => u.Auth0Id)
                     .IsUnique();

              builder.HasIndex(u => u.Email)
                     .IsUnique();

              builder.Property(u => u.Auth0Id)
                      .IsRequired()
                      .HasMaxLength(255);

              builder.Property(u => u.Email)
                     .IsRequired()
                     .HasMaxLength(255);

              builder.Property(u => u.Name)
                     .IsRequired()
                     .HasMaxLength(100);

              builder.Property(u => u.PictureUrl)
                     .HasMaxLength(500);

              builder.Property(u => u.RoleId)
                  .HasDefaultValue(1);

              // Quan hệ 1-N: 1 Role có nhiều User
              builder.HasOne(u => u.Role)
                     .WithMany(r => r.Users)
                     .HasForeignKey(u => u.RoleId);

              builder.HasOne(u => u.Department)
                          .WithMany(d => d.Users)
                          .HasForeignKey(u => u.DepartmentId)
                          .OnDelete(DeleteBehavior.SetNull);

       }
}