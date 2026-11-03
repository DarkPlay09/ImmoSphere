using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class StatutRendezVousConfiguration : IEntityTypeConfiguration<StatutRendezVousEntity>
{
    public void Configure(EntityTypeBuilder<StatutRendezVousEntity> builder)
    {
        builder.ToTable("statut");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_statut").ValueGeneratedOnAdd();
        builder.Property(e => e.Libelle).HasColumnName("libelle").IsRequired();
    }
}
