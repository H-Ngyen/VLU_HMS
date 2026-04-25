using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal class XRayConfiguration : IEntityTypeConfiguration<XRay>
{
       public void Configure(EntityTypeBuilder<XRay> builder)
       {
              builder.ToTable("XRays");

              // ===== PROPERTIES =====
              builder.Property(x => x.RequestDescription)
                     .IsRequired()
                     .HasMaxLength(1000);

              builder.Property(x => x.ResultDescription)
                     .HasMaxLength(4000);

              builder.Property(x => x.DoctorAdvice)
                     .HasMaxLength(2000);

              builder.Property(x => x.Status)
                     .IsRequired();

              builder.Property(x => x.DepartmentOfHealth)
                     .HasMaxLength(255);

              builder.Property(x => x.HospitalName)
                     .HasMaxLength(255);

              builder.Property(x => x.FormNumber)
                     .HasMaxLength(50);

              builder.Property(x => x.RoomNumber)
                     .HasMaxLength(50);

              builder.Property(x => x.BedNumber)
                     .HasMaxLength(50);

              // ===== RELATIONSHIPS =====

              // MedicalRecord
              builder.HasOne(x => x.MedicalRecord)
                     .WithMany(m => m.XRays)
                     .HasForeignKey(x => x.MedicalRecordId)
                     .OnDelete(DeleteBehavior.Cascade);

              // RequestedBy
              builder.HasOne(x => x.RequestedBy)
                     .WithMany()
                     .HasForeignKey(x => x.RequestedById)
                     .OnDelete(DeleteBehavior.Restrict);

              // PerformedBy
              builder.HasOne(x => x.PerformedBy)
                     .WithMany()
                     .HasForeignKey(x => x.PerformedById)
                     .OnDelete(DeleteBehavior.Restrict);

              // ===== NEW: StatusLogs =====
              builder.HasMany(x => x.XRayStatusLogs)
                     .WithOne(l => l.XRay)
                     .HasForeignKey(l => l.XRayId)
                     .OnDelete(DeleteBehavior.Cascade);

              // ===== INDEX =====
              builder.HasIndex(x => x.MedicalRecordId);
       }
}