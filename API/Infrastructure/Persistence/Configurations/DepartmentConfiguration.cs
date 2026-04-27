using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal class DepartmentConfiguration : IEntityTypeConfiguration<Department>
{
       public void Configure(EntityTypeBuilder<Department> builder)
       {
              builder.HasKey(d => d.Id);

              // 1. Cấu hình mối quan hệ "Trưởng khoa" (1-1)
              // Một khoa có 1 Trưởng khoa, và một User chỉ làm Trưởng khoa cho 1 khoa duy nhất.
              builder.HasOne(d => d.HeadUser)
                     .WithOne() // Sử dụng WithOne thay vì WithMany để đảm bảo tính duy nhất (1-1)
                     .HasForeignKey<Department>(d => d.HeadUserId) // Khai báo FK nằm ở bảng Department
                     .OnDelete(DeleteBehavior.SetNull);

              // 2. Cấu hình mối quan hệ "Nhân viên thuộc khoa" (1-N)
              // Một khoa có nhiều Users, mỗi User chỉ thuộc về 1 khoa.
              builder.HasMany(d => d.Users)
                     .WithOne(u => u.Department) // Trỏ về Navigation Property trong bảng User
                     .HasForeignKey(u => u.DepartmentId)
                     .OnDelete(DeleteBehavior.SetNull);

              builder.Property(d => d.Name)
                     .IsRequired()
                     .HasMaxLength(100);
       }
}