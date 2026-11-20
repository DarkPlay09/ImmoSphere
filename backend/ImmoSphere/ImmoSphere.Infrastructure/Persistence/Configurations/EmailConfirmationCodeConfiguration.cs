using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class EmailConfirmationCodeConfiguration
    : IEntityTypeConfiguration<EmailConfirmationCodeEntity>
{
    public void Configure(EntityTypeBuilder<EmailConfirmationCodeEntity> builder)
    {
        // Nom de la table
        builder.ToTable("EmailConfirmationCodes");

        // Clé primaire
        builder.HasKey(e => e.Id);

        // Identifiant utilisateur
        builder.Property(e => e.UserId)
            .IsRequired()
            .HasMaxLength(450);

        // Empreinte du code
        builder.Property(e => e.CodeHash)
            .IsRequired()
            .HasMaxLength(128);

        // Dates
        builder.Property(e => e.CreatedAtUtc)
            .IsRequired();

        builder.Property(e => e.ExpiresAtUtc)
            .IsRequired();

        // Nombre de tentatives
        builder.Property(e => e.Attempts)
            .HasDefaultValue(0);

        // Code utilisé ou non
        builder.Property(e => e.IsUsed)
            .HasDefaultValue(false);

        // Un seul enregistrement de confirmation par utilisateur
        builder.HasIndex(e => e.UserId)
            .IsUnique();

        // Relation avec ASP.NET Core Identity
        builder.HasOne<ApplicationUser>()
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}