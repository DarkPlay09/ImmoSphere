using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class TypeConfigurationConfiguration : IEntityTypeConfiguration<TypeConfigurationEntity>
{
    public void Configure(EntityTypeBuilder<TypeConfigurationEntity> builder)
    {
        builder.ToTable("type_configuration");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_configuration").ValueGeneratedOnAdd();
        builder.Property(e => e.Libelle).HasColumnName("libelle").IsRequired();
    }
}
