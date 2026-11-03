using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class DemandeCreationAgenceConfiguration : IEntityTypeConfiguration<DemandeCreationAgenceEntity>
{
    public void Configure(EntityTypeBuilder<DemandeCreationAgenceEntity> builder)
    {
        builder.ToTable("demande_creation_agence");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_creation").ValueGeneratedOnAdd();
        builder.Property(e => e.Nom).HasColumnName("nom").IsRequired();
        builder.Property(e => e.Description).HasColumnName("Description");

        // Associations et clés étrangères
        builder.Property(e => e.UtilisateurId).HasColumnName("id_utilisateur");
        builder.HasOne(e => e.Utilisateur)
            .WithMany(e => e.DemandesCreationAgence)
            .HasForeignKey(e => e.UtilisateurId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
