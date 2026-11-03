using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class EmoticonConfiguration : IEntityTypeConfiguration<EmoticonEntity>
{
    public void Configure(EntityTypeBuilder<EmoticonEntity> builder)
    {
        builder.ToTable("emoticon");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_emoticon").ValueGeneratedOnAdd();
        builder.Property(e => e.Chemin).HasColumnName("chemin").IsRequired();
    }
}
