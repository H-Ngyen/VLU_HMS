using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal class HematologyStatusLogConfiguration : IEntityTypeConfiguration<HematologyStatusLog>
{
    public void Configure(EntityTypeBuilder<HematologyStatusLog> builder)
    {
        builder.ToTable("HematologyStatusLogs");

        // ===== PROPERTIES =====
        builder.Property(x => x.DepartmentName)
               .IsRequired()
               .HasMaxLength(255);

        builder.Property(x => x.Status)
               .IsRequired();

        builder.Property(x => x.CreatedAt)
               .IsRequired();

        // ===== RELATIONSHIPS =====
        builder.HasOne(x => x.Hematology)
               .WithMany(x => x.HematologyStatusLogs)
               .HasForeignKey(x => x.HematologyId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.UpdatedBy)
               .WithMany()
               .HasForeignKey(x => x.UpdatedById)
               .OnDelete(DeleteBehavior.Restrict);

        // ===== INDEX =====
        builder.HasIndex(x => x.HematologyId);
        builder.HasIndex(x => new { x.HematologyId, x.CreatedAt });
    }
}