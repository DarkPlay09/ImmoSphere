using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class SouscriptionConfiguration : IEntityTypeConfiguration<SouscriptionEntity>
{
    public void Configure(EntityTypeBuilder<SouscriptionEntity> builder)
    {
        builder.ToTable("souscription");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_souscription").ValueGeneratedOnAdd();
        builder.Property(e => e.DateDebut).HasColumnName("date_debut").HasColumnType("date");
        builder.Property(e => e.DateFin).HasColumnName("date_fin").HasColumnType("date");

        // Associations et clés étrangères
        builder.Property(e => e.UtilisateurId).HasColumnName("id_utilisateur");
        builder.HasOne(e => e.Utilisateur)
            .WithMany(e => e.Souscriptions)
            .HasForeignKey(e => e.UtilisateurId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(e => e.AbonnementId).HasColumnName("id_abonnement");
        builder.HasOne(e => e.Abonnement)
            .WithMany(e => e.Souscriptions)
            .HasForeignKey(e => e.AbonnementId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(e => e.StatutSouscriptionId).HasColumnName("id_statut");
        builder.HasOne(e => e.StatutSouscription)
            .WithMany(e => e.Souscriptions)
            .HasForeignKey(e => e.StatutSouscriptionId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
