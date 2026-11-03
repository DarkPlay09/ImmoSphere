using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class TypeTransactionConfiguration : IEntityTypeConfiguration<TypeTransactionEntity>
{
    public void Configure(EntityTypeBuilder<TypeTransactionEntity> builder)
    {
        builder.ToTable("type_transaction");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_transaction").ValueGeneratedOnAdd();
        builder.Property(e => e.Libelle).HasColumnName("libelle").IsRequired();
    }
}
