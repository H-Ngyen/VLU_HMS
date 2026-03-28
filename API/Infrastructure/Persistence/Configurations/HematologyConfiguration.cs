using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal class HematologyConfiguration : IEntityTypeConfiguration<Hematology>
{
       public void Configure(EntityTypeBuilder<Hematology> builder)
       {
              builder.ToTable("Hematologies");

              // ===== PROPERTIES =====
              // builder.Property(h => h.IsEmergency)
              //        .HasDefaultValue(false);

              builder.Property(h => h.Status)
                     .IsRequired();

              // Text fields
              builder.Property(h => h.NucleatedRedBloodCell).HasMaxLength(50);
              builder.Property(h => h.AbnormalCells).HasMaxLength(500);
              builder.Property(h => h.MalariaParasite).HasMaxLength(100);

              // Enum -> int
              builder.Property(h => h.BloodTypeAbo).HasConversion<int>();
              builder.Property(h => h.BloodTypeRh).HasConversion<int>();

              // ===== RELATIONSHIPS =====

              builder.HasOne(h => h.MedicalRecord)
                     .WithMany(m => m.Hematologies)
                     .HasForeignKey(h => h.MedicalRecordId)
                     .OnDelete(DeleteBehavior.Cascade);

              builder.HasOne(h => h.RequestedBy)
                     .WithMany()
                     .HasForeignKey(h => h.RequestedById)
                     .OnDelete(DeleteBehavior.Restrict);

              builder.HasOne(h => h.PerformedBy)
                     .WithMany()
                     .HasForeignKey(h => h.PerformedById)
                     .OnDelete(DeleteBehavior.Restrict);

              // ===== NEW: StatusLogs =====
              builder.HasMany(h => h.HematologyStatusLogs)
                     .WithOne(l => l.Hematology)
                     .HasForeignKey(l => l.HematologyId)
                     .OnDelete(DeleteBehavior.Cascade);

              // ===== INDEX =====
              builder.HasIndex(h => h.MedicalRecordId);
       }
}