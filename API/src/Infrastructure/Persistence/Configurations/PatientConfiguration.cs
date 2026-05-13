using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal class PatientConfiguration : IEntityTypeConfiguration<Patient>
{
    public void Configure(EntityTypeBuilder<Patient> builder)
    {
        builder.Property(p => p.Name).IsRequired().HasMaxLength(100);
        builder.Property(p => p.DateOfBirth).HasColumnType("date");
        builder.Property(p => p.HealthInsuranceNumber).IsRequired().HasMaxLength(20);
        builder.Property(p => p.EthnicityId).HasDefaultValue(56);

        // Chuyển đổi Enum Gender -> int 1, 2, 3
        builder.Property(p => p.Gender).IsRequired();

        // Quan hệ
        builder.HasOne(p => p.Ethnicity)
               .WithMany()
               .HasForeignKey(p => p.EthnicityId);

        builder.HasOne(p => p.Creator)
               .WithMany()
               .HasForeignKey(p => p.CreatedBy)
               .OnDelete(DeleteBehavior.Restrict);
    }
}