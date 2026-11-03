using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class EtatConfiguration : IEntityTypeConfiguration<EtatEntity>
{
    public void Configure(EntityTypeBuilder<EtatEntity> builder)
    {
        builder.ToTable("etat");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_etat").ValueGeneratedOnAdd();
        builder.Property(e => e.Libelle).HasColumnName("libelle").IsRequired();
    }
}
