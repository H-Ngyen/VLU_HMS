using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal class XRayStatusLogConfiguration : IEntityTypeConfiguration<XRayStatusLog>
{
       public void Configure(EntityTypeBuilder<XRayStatusLog> builder)
       {
              builder.ToTable("XRayStatusLogs");

              // ===== PROPERTIES =====
              builder.Property(x => x.DepartmentName)
                     .IsRequired()
                     .HasMaxLength(255);

              builder.Property(x => x.Status)
                     .IsRequired();

              builder.Property(x => x.CreatedAt)
                     .IsRequired();

              // ===== RELATIONSHIPS =====
              builder.HasOne(x => x.XRay)
                     .WithMany(x => x.XRayStatusLogs)
                     .HasForeignKey(x => x.XRayId)
                     .OnDelete(DeleteBehavior.Cascade);

              builder.HasOne(x => x.UpdatedBy)
                     .WithMany()
                     .HasForeignKey(x => x.UpdatedById)
                     .OnDelete(DeleteBehavior.Restrict);

              // ===== INDEX =====
              builder.HasIndex(x => x.XRayId);
              builder.HasIndex(x => new { x.XRayId, x.CreatedAt });
       }
}