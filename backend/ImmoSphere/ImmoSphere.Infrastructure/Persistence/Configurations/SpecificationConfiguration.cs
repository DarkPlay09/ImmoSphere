using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class SpecificationConfiguration : IEntityTypeConfiguration<SpecificationEntity>
{
    public void Configure(EntityTypeBuilder<SpecificationEntity> builder)
    {
        builder.ToTable("specifications");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_specification").ValueGeneratedOnAdd();
        builder.Property(e => e.Titre).HasColumnName("titre").IsRequired();
        builder.Property(e => e.Description).HasColumnName("description");
        builder.Property(e => e.Emoticon).HasColumnName("emoticon");

        // Associations et clés étrangères
        builder.Property(e => e.EmoticonId).HasColumnName("id_emoticon");
        builder.HasOne(e => e.EmoticonReference)
            .WithMany(e => e.Specifications)
            .HasForeignKey(e => e.EmoticonId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
