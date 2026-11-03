using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class ProvinceConfiguration : IEntityTypeConfiguration<ProvinceEntity>
{
    public void Configure(EntityTypeBuilder<ProvinceEntity> builder)
    {
        builder.ToTable("province");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_province").ValueGeneratedOnAdd();
        builder.Property(e => e.Libelle).HasColumnName("libelle").IsRequired();
    }
}
