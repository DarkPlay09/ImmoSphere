using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class ImageConfiguration : IEntityTypeConfiguration<ImageEntity>
{
    public void Configure(EntityTypeBuilder<ImageEntity> builder)
    {
        builder.ToTable("image");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_image").ValueGeneratedOnAdd();
        builder.Property(e => e.Chemin).HasColumnName("chemin").IsRequired();
        builder.Property(e => e.Ordre).HasColumnName("ordre").IsRequired();
        builder.Property(e => e.TexteAlternatif)
            .HasColumnName("texte_alternatif")
            .IsRequired();

        // Associations et clés étrangères
        builder.Property(e => e.BienId).HasColumnName("id_bien");
        builder.HasOne(e => e.Bien)
            .WithMany(e => e.Images)
            .HasForeignKey(e => e.BienId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
