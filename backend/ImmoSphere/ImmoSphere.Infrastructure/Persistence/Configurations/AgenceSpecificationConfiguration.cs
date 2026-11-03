using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class AgenceSpecificationConfiguration : IEntityTypeConfiguration<AgenceSpecificationEntity>
{
    public void Configure(EntityTypeBuilder<AgenceSpecificationEntity> builder)
    {
        builder.ToTable("agence_specification");
        builder.HasKey(e => new { e.AgenceId, e.SpecificationId });
        builder.Property(e => e.AgenceId).HasColumnName("id_agence");
        builder.Property(e => e.SpecificationId).HasColumnName("id_specification");
        builder.HasOne(e => e.Agence)
            .WithMany(e => e.Specifications)
            .HasForeignKey(e => e.AgenceId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(e => e.Specification)
            .WithMany(e => e.Agences)
            .HasForeignKey(e => e.SpecificationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
