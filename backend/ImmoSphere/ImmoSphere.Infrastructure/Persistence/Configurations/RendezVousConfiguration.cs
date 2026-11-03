using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class RendezVousConfiguration : IEntityTypeConfiguration<RendezVousEntity>
{
    public void Configure(EntityTypeBuilder<RendezVousEntity> builder)
    {
        builder.ToTable("rendez_vous");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_rdv").ValueGeneratedOnAdd();
        builder.Property(e => e.DateHeure).HasColumnName("date_heure").HasColumnType("timestamp with time zone").IsRequired();

        // Associations et clés étrangères
        builder.Property(e => e.BienId).HasColumnName("id_bien");
        builder.HasOne(e => e.Bien)
            .WithMany(e => e.RendezVous)
            .HasForeignKey(e => e.BienId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(e => e.ProposeParId).HasColumnName("id_utilisateur_proposeur");
        builder.HasOne(e => e.ProposePar)
            .WithMany(e => e.RendezVousProposes)
            .HasForeignKey(e => e.ProposeParId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(e => e.StatutRendezVousId).HasColumnName("id_statut");
        builder.HasOne(e => e.StatutRendezVous)
            .WithMany(e => e.RendezVous)
            .HasForeignKey(e => e.StatutRendezVousId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
