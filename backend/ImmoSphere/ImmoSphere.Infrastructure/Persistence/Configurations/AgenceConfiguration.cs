using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class AgenceConfiguration : IEntityTypeConfiguration<AgenceEntity>
{
    public void Configure(EntityTypeBuilder<AgenceEntity> builder)
    {
        builder.ToTable("agence");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_agence").ValueGeneratedOnAdd();
        builder.Property(e => e.Nom).HasColumnName("nom").IsRequired();
        builder.Property(e => e.Description).HasColumnName("description");
        builder.Property(e => e.Logo).HasColumnName("logo");
        builder.Property(e => e.ImgBackground).HasColumnName("img_background");
        builder.Property(e => e.Localite).HasColumnName("localite");
        builder.Property(e => e.Rue).HasColumnName("rue");
        builder.Property(e => e.Numero).HasColumnName("numero");
        builder.Property(e => e.CodePostal).HasColumnName("code_postal");
        builder.Property(e => e.NumeroTel).HasColumnName("numero_tel");
        builder.Property(e => e.Mail).HasColumnName("mail");
        builder.Property(e => e.LienPlateforme).HasColumnName("lien_plateforme");
        builder.Property(e => e.Bce).HasColumnName("bce");
    }
}
