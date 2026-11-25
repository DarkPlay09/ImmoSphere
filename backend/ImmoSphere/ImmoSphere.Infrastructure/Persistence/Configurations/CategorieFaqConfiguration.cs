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

        // Données de référence de la maquette, créées par la migration dans toutes les bases
        // (le DatabaseSeeder ne tourne qu'en Development).
        builder.HasData(
            new CategorieFaqEntity { Id = 1, Code = "account", Ordre = 1 },
            new CategorieFaqEntity { Id = 2, Code = "searchProperty", Ordre = 2 },
            new CategorieFaqEntity { Id = 3, Code = "visitsAppointments", Ordre = 3 },
            new CategorieFaqEntity { Id = 4, Code = "publishProperty", Ordre = 4 },
            new CategorieFaqEntity { Id = 5, Code = "notariesReviews", Ordre = 5 });
    }
}
