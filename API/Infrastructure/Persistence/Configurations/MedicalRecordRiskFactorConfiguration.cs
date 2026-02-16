using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal class MedicalRecordRiskFactorConfiguration : IEntityTypeConfiguration<MedicalRecordRiskFactor>
{
    public void Configure(EntityTypeBuilder<MedicalRecordRiskFactor> builder)
    {
        builder.Property(r => r.IsPossible).HasDefaultValue(false);

        // Quan hệ N-1 với Detail
        builder.HasOne(r => r.MedicalRecordDetail)
               .WithMany(d => d.RiskFactors)
               .HasForeignKey(r => r.MedicalRecordDetailId);
    }
}