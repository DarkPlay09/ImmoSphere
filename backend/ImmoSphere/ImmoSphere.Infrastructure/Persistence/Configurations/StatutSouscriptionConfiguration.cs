using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class StatutSouscriptionConfiguration : IEntityTypeConfiguration<StatutSouscriptionEntity>
{
    public void Configure(EntityTypeBuilder<StatutSouscriptionEntity> builder)
    {
        builder.ToTable("statut2");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_statut").ValueGeneratedOnAdd();
        builder.Property(e => e.Libelle).HasColumnName("libelle").IsRequired();
    }
}
