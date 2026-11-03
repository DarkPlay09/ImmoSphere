using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class PebBienConfiguration : IEntityTypeConfiguration<PebBienEntity>
{
    public void Configure(EntityTypeBuilder<PebBienEntity> builder)
    {
        builder.ToTable("peb_bien");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_peb").ValueGeneratedOnAdd();
        builder.Property(e => e.Libelle).HasColumnName("libelle").IsRequired();
    }
}
