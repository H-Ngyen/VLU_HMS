using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal class MedicalAttachmentConfiguration : IEntityTypeConfiguration<MedicalAttachment>
{
    public void Configure(EntityTypeBuilder<MedicalAttachment> builder)
    {
        builder.Property(a => a.Name).IsRequired().HasMaxLength(255);
        builder.Property(a => a.Path).IsRequired().HasMaxLength(255);

        builder.HasOne(a => a.MedicalRecord)
               .WithMany(m => m.Attachments)
               .HasForeignKey(a => a.MedicalRecordId);
    }
}