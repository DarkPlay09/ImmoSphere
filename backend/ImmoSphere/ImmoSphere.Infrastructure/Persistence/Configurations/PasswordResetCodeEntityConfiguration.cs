using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class PasswordResetCodeEntityConfiguration
    : IEntityTypeConfiguration<PasswordResetCodeEntity>
{
    public void Configure(EntityTypeBuilder<PasswordResetCodeEntity> builder)
    {
        builder.ToTable("PasswordResetCodes");

        builder.HasKey(x => x.UserId);

        builder.Property(x => x.CodeHash)
            .IsRequired();

        builder.Property(x => x.CreatedAtUtc)
            .IsRequired();

        builder.Property(x => x.ExpiresAtUtc)
            .IsRequired();

        builder.Property(x => x.Attempts)
            .IsRequired();

        builder.Property(x => x.IsUsed)
            .IsRequired();
    }
}