using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal class HematologyConfiguration : IEntityTypeConfiguration<Hematology>
{
    public void Configure(EntityTypeBuilder<Hematology> builder)
    {
        builder.Property(h => h.IsEmergency).HasDefaultValue(false);

        // Giới hạn độ dài các trường Text ngắn
        builder.Property(h => h.NucleatedRedBloodCell).HasMaxLength(50);
        builder.Property(h => h.AbnormalCells).HasMaxLength(500);
        builder.Property(h => h.MalariaParasite).HasMaxLength(100);

        // Enum -> int
        builder.Property(h => h.BloodTypeAbo).HasConversion<int>();
        builder.Property(h => h.BloodTypeRh).HasConversion<int>();

        // Quan hệ với MedicalRecord
        builder.HasOne(h => h.MedicalRecord)
               .WithMany(m => m.Hematologies)
               .HasForeignKey(h => h.MedicalRecordId)
               .OnDelete(DeleteBehavior.Cascade);

        // Quan hệ với User (Bác sĩ)
        builder.HasOne(h => h.RequestedBy)
               .WithMany()
               .HasForeignKey(h => h.RequestedById)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(h => h.PerformedBy)
               .WithMany()
               .HasForeignKey(h => h.PerformedById)
               .OnDelete(DeleteBehavior.Restrict);
    }
}