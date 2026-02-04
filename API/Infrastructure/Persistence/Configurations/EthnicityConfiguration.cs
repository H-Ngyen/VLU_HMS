using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

internal class EthnicityConfiguration : IEntityTypeConfiguration<Ethnicity>
{
    public void Configure(EntityTypeBuilder<Ethnicity> builder)
    {
        builder.Property(e => e.Id).ValueGeneratedNever(); // ID tự nhập
        builder.Property(e => e.Name).IsRequired().HasMaxLength(20);
    }
}