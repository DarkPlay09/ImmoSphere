using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<RoleEntity>
{
    public void Configure(EntityTypeBuilder<RoleEntity> builder)
    {
        builder.ToTable("role");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_role").ValueGeneratedOnAdd();
        builder.Property(e => e.Libelle).HasColumnName("libelle").IsRequired();
    }
}
