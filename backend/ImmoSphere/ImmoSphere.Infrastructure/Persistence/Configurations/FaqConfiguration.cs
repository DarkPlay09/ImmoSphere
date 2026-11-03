using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class FaqConfiguration : IEntityTypeConfiguration<FaqEntity>
{
    public void Configure(EntityTypeBuilder<FaqEntity> builder)
    {
        builder.ToTable("faq");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_faq").ValueGeneratedOnAdd();
        builder.Property(e => e.Titre).HasColumnName("titre").IsRequired();
        builder.Property(e => e.Libelle).HasColumnName("libelle");

        // Associations et clés étrangères
        builder.Property(e => e.UtilisateurId).HasColumnName("id_utilisateur");
        builder.HasOne(e => e.Utilisateur)
            .WithMany(e => e.Faqs)
            .HasForeignKey(e => e.UtilisateurId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
