using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class DisponibiliteConfiguration : IEntityTypeConfiguration<DisponibiliteEntity>
{
    public void Configure(EntityTypeBuilder<DisponibiliteEntity> builder)
    {
        builder.ToTable("disponibilite");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_disponibilite").ValueGeneratedOnAdd();
        builder.Property(e => e.Date).HasColumnName("date").HasColumnType("date").IsRequired();
        builder.Property(e => e.Heure).HasColumnName("heure").HasColumnType("time without time zone").IsRequired();

        // Associations et clés étrangères
        builder.Property(e => e.BienId).HasColumnName("id_bien");
        builder.HasOne(e => e.Bien)
            .WithMany(e => e.Disponibilites)
            .HasForeignKey(e => e.BienId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(e => e.StatutDisponibiliteId).HasColumnName("id_statut");
        builder.HasOne(e => e.StatutDisponibilite)
            .WithMany(e => e.Disponibilites)
            .HasForeignKey(e => e.StatutDisponibiliteId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
