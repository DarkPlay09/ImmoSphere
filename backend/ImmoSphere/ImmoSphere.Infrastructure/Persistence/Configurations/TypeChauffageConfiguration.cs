using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class TypeChauffageConfiguration : IEntityTypeConfiguration<TypeChauffageEntity>
{
    public void Configure(EntityTypeBuilder<TypeChauffageEntity> builder)
    {
        builder.ToTable("type_chauffage");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_chauffage").ValueGeneratedOnAdd();
        builder.Property(e => e.Libelle).HasColumnName("libelle").IsRequired();
    }
}
