using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class BienInformationAnnexeConfiguration : IEntityTypeConfiguration<BienInformationAnnexeEntity>
{
    public void Configure(EntityTypeBuilder<BienInformationAnnexeEntity> builder)
    {
        builder.ToTable("bien_information_annexe");
        builder.HasKey(e => new { e.BienId, e.InformationAnnexeId });
        builder.Property(e => e.BienId).HasColumnName("id_bien");
        builder.Property(e => e.InformationAnnexeId).HasColumnName("id_information");
        builder.HasOne(e => e.Bien)
            .WithMany(e => e.InformationsAnnexes)
            .HasForeignKey(e => e.BienId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(e => e.InformationAnnexe)
            .WithMany(e => e.Biens)
            .HasForeignKey(e => e.InformationAnnexeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
