using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class TypeBienConfiguration : IEntityTypeConfiguration<TypeBienEntity>
{
    public void Configure(EntityTypeBuilder<TypeBienEntity> builder)
    {
        builder.ToTable("type_bien");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_type").ValueGeneratedOnAdd();
        builder.Property(e => e.Libelle).HasColumnName("libelle").IsRequired();
    }
}
