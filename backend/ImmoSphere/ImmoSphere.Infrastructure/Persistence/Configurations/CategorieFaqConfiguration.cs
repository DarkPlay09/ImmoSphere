using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class CategorieFaqConfiguration : IEntityTypeConfiguration<CategorieFaqEntity>
{
    private const int LongueurMaxCode = 50;

    public void Configure(EntityTypeBuilder<CategorieFaqEntity> builder)
    {
        builder.ToTable("categorie_faq");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_categorie_faq").ValueGeneratedOnAdd();
        builder.Property(e => e.Code).HasColumnName("code").HasMaxLength(LongueurMaxCode).IsRequired();
        builder.Property(e => e.Ordre).HasColumnName("ordre").IsRequired();

        builder.HasIndex(e => e.Code).IsUnique();
    }
}
