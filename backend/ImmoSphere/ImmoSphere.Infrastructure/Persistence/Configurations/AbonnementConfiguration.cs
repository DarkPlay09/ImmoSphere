using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class AbonnementConfiguration : IEntityTypeConfiguration<AbonnementEntity>
{
    public void Configure(EntityTypeBuilder<AbonnementEntity> builder)
    {
        builder.ToTable("abonnement");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_abonnement").ValueGeneratedOnAdd();
        builder.Property(e => e.Nom).HasColumnName("nom").IsRequired();
        builder.Property(e => e.Prix).HasColumnName("prix").HasPrecision(18, 2);
        builder.Property(e => e.Duree).HasColumnName("duree");
    }
}
