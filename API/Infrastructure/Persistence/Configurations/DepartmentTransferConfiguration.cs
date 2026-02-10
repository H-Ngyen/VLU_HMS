using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal class DepartmentTransferConfiguration : IEntityTypeConfiguration<DepartmentTransfer>
{
    public void Configure(EntityTypeBuilder<DepartmentTransfer> builder)
    {
        builder.Property(d => d.Name).HasMaxLength(20);
        builder.Property(d => d.TreatmentDays).HasMaxLength(5);

        builder.HasOne(d => d.MedicalRecord)
               .WithMany(m => m.DepartmentTransfers)
               .HasForeignKey(d => d.MedicalRecordId);
    }
}