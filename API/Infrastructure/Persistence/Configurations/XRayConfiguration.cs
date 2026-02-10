using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal class XRayConfiguration : IEntityTypeConfiguration<XRay>
{
    public void Configure(EntityTypeBuilder<XRay> builder)
    {
        builder.Property(x => x.RequestDescription).IsRequired().HasMaxLength(1000);
        builder.Property(x => x.ResultDescription).HasMaxLength(4000);
        builder.Property(x => x.DoctorAdvice).HasMaxLength(2000);

        // Quan hệ với MedicalRecord (Xóa HSBA sẽ xóa luôn phiếu XQuang)
        builder.HasOne(x => x.MedicalRecord)
               .WithMany(m => m.XRays)
               .HasForeignKey(x => x.MedicalRecordId)
               .OnDelete(DeleteBehavior.Cascade); 

        // Quan hệ với User (Bác sĩ) -> Phải dùng Restrict để không xóa nhầm User
        builder.HasOne(x => x.RequestedBy)
               .WithMany()
               .HasForeignKey(x => x.RequestedById)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.PerformedBy)
               .WithMany()
               .HasForeignKey(x => x.PerformedById)
               .OnDelete(DeleteBehavior.Restrict);
    }
}