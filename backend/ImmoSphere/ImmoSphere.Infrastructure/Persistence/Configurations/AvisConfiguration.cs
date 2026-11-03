using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class AvisConfiguration : IEntityTypeConfiguration<AvisEntity>
{
    public void Configure(EntityTypeBuilder<AvisEntity> builder)
    {
        builder.ToTable("avis");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_avis").ValueGeneratedOnAdd();
        builder.Property(e => e.Libelle).HasColumnName("libelle");
        builder.Property(e => e.NbEtoiles).HasColumnName("nb_etoiles");

        // Associations et clés étrangères
        builder.Property(e => e.AuteurId).HasColumnName("id_utilisateur_auteur");
        builder.HasOne(e => e.Auteur)
            .WithMany(e => e.AvisRediges)
            .HasForeignKey(e => e.AuteurId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(e => e.UtilisateurEvalueId).HasColumnName("id_utilisateur_evalue");
        builder.HasOne(e => e.UtilisateurEvalue)
            .WithMany(e => e.AvisRecus)
            .HasForeignKey(e => e.UtilisateurEvalueId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
