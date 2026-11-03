using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class InformationAnnexeConfiguration : IEntityTypeConfiguration<InformationAnnexeEntity>
{
    public void Configure(EntityTypeBuilder<InformationAnnexeEntity> builder)
    {
        builder.ToTable("informations_annexes");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_information").ValueGeneratedOnAdd();
        builder.Property(e => e.Libelle).HasColumnName("libelle").IsRequired();
    }
}
