using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class StatutDisponibiliteConfiguration : IEntityTypeConfiguration<StatutDisponibiliteEntity>
{
    public void Configure(EntityTypeBuilder<StatutDisponibiliteEntity> builder)
    {
        builder.ToTable("statut_dispo");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_statut").ValueGeneratedOnAdd();
        builder.Property(e => e.Libelle).HasColumnName("libelle").IsRequired();
    }
}
