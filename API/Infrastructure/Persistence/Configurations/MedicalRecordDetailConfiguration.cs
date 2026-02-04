using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal class MedicalRecordDetailConfiguration : IEntityTypeConfiguration<MedicalRecordDetail>
{
    public void Configure(EntityTypeBuilder<MedicalRecordDetail> builder)
    {
        // PK không tự tăng (vì dùng chung Id với MedicalRecord)
        builder.Property(d => d.Id).ValueGeneratedNever();

        // Cấu hình các trường text dài
        builder.Property(d => d.PathologicalProcess).HasMaxLength(2000);
        builder.Property(d => d.PersonalHistory).HasMaxLength(2000);
        builder.Property(d => d.FamilyHistory).HasMaxLength(2000);
        builder.Property(d => d.ExamGeneral).HasMaxLength(2000);
        // ... (Bạn có thể thêm tiếp các trường Exam khác nếu muốn giới hạn)

        builder.Property(d => d.BodyWeight).IsRequired().HasMaxLength(5);
        builder.Property(d => d.PulseRate).HasMaxLength(5);
        builder.Property(d => d.Temperature).HasMaxLength(5);
        builder.Property(d => d.BloodPressure).HasMaxLength(10);
    }
}