using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class AgenceAdministrateurConfiguration : IEntityTypeConfiguration<AgenceAdministrateurEntity>
{
    public void Configure(EntityTypeBuilder<AgenceAdministrateurEntity> builder)
    {
        builder.ToTable("agence_administrateur");
        builder.HasKey(e => new { e.AgenceId, e.UtilisateurId });
        builder.Property(e => e.AgenceId).HasColumnName("id_agence");
        builder.Property(e => e.UtilisateurId).HasColumnName("id_utilisateur");
        builder.HasOne(e => e.Agence)
            .WithMany(e => e.Administrateurs)
            .HasForeignKey(e => e.AgenceId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(e => e.Utilisateur)
            .WithMany(e => e.AgencesAdministrees)
            .HasForeignKey(e => e.UtilisateurId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
