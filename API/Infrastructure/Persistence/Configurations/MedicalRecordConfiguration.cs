using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal class MedicalRecordConfiguration : IEntityTypeConfiguration<MedicalRecord>
{
    public void Configure(EntityTypeBuilder<MedicalRecord> builder)
    {
        builder.Property(m => m.AdmissionCount).HasDefaultValue("1");

        // Độ dài chuỗi
        builder.Property(m => m.FormCode).HasMaxLength(20);
        builder.Property(m => m.StorageCode).HasMaxLength(20);
        builder.Property(m => m.MedicalCode).HasMaxLength(20);
        builder.Property(m => m.BedCode).HasMaxLength(20);
        builder.Property(m => m.Address).HasMaxLength(255);

        // Quan hệ
        builder.HasOne(m => m.Patient)
               .WithMany(p => p.MedicalRecords)
               .HasForeignKey(m => m.PatientId);

        builder.HasOne(m => m.Creator)
               .WithMany()
               .HasForeignKey(m => m.CreatedBy);

        // Quan hệ 1-1 với Detail
        // MedicalRecord (Principal) <---> Detail (Dependent)
        builder.HasOne(m => m.Detail)
               .WithOne(d => d.MedicalRecord)
               .HasForeignKey<MedicalRecordDetail>(d => d.Id);
    }
}