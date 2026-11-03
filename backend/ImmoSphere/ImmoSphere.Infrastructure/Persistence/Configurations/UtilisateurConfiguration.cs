using ImmoSphere.Infrastructure.Persistence.Entities;
using ImmoSphere.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class UtilisateurConfiguration : IEntityTypeConfiguration<UtilisateurEntity>
{
    public void Configure(EntityTypeBuilder<UtilisateurEntity> builder)
    {
        builder.ToTable("utilisateur");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_utilisateur").ValueGeneratedOnAdd();
        builder.Property(e => e.Nom).HasColumnName("nom").IsRequired();
        builder.Property(e => e.Prenom).HasColumnName("prenom").IsRequired();
        builder.Property(e => e.IdentityUserId)
            .HasColumnName("identity_user_id")
            .HasMaxLength(450)
            .IsRequired();

        builder.HasIndex(e => e.IdentityUserId).IsUnique();
        builder.HasOne(e => e.IdentityUser)
            .WithOne()
            .HasForeignKey<UtilisateurEntity>(e => e.IdentityUserId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.Property(e => e.Telephone).HasColumnName("telephone");
        builder.Property(e => e.PhotoProfil).HasColumnName("photo_profil");

        // Associations et clés étrangères
        builder.Property(e => e.AgenceId).HasColumnName("id_agence");
        builder.HasOne(e => e.Agence)
            .WithMany(e => e.Membres)
            .HasForeignKey(e => e.AgenceId)
            .OnDelete(DeleteBehavior.Restrict);

    }
}
