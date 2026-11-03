using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class FavoriConfiguration : IEntityTypeConfiguration<FavoriEntity>
{
    public void Configure(EntityTypeBuilder<FavoriEntity> builder)
    {
        builder.ToTable("favori");
        builder.HasKey(e => new { e.UtilisateurId, e.BienId });
        builder.Property(e => e.UtilisateurId).HasColumnName("id_utilisateur");
        builder.Property(e => e.BienId).HasColumnName("id_bien");
        builder.HasOne(e => e.Utilisateur)
            .WithMany(e => e.Favoris)
            .HasForeignKey(e => e.UtilisateurId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(e => e.Bien)
            .WithMany(e => e.Favoris)
            .HasForeignKey(e => e.BienId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
