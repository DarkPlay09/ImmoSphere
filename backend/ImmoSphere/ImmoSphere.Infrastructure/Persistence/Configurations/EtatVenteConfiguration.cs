using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class EtatVenteConfiguration : IEntityTypeConfiguration<EtatVenteEntity>
{
    public void Configure(EntityTypeBuilder<EtatVenteEntity> builder)
    {
        builder.ToTable("etat_vente");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_etat").ValueGeneratedOnAdd();
        builder.Property(e => e.Libelle).HasColumnName("libelle").IsRequired();
    }
}
