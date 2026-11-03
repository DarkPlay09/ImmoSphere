using ImmoSphere.Infrastructure.Persistence;
using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.AspNetCore.Identity;

namespace ImmoSphere.Infrastructure.Identity;

/// <summary>
/// Enregistre un client et son profil métier de manière atomique.
/// Exposer une opération distincte, autorisée côté serveur, pour la promotion vers d'autres rôles.
/// </summary>
public sealed class UtilisateurRegistrationService(
    UserManager<ApplicationUser> userManager,
    ApplicationDbContext db)
{
    public async Task<IdentityResult> RegisterClientAsync(
        string email, string password, string nom, string prenom,
        string? telephone = null, CancellationToken cancellationToken = default)
    {
        await using var transaction = await db.Database.BeginTransactionAsync(cancellationToken);

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            EmailConfirmed = false
        };

        var creation = await userManager.CreateAsync(user, password);
        if (!creation.Succeeded)
            return creation; // La transaction est abandonnée à la sortie du using.

        var attributionRole = await userManager.AddToRoleAsync(user, RoleNames.Client);
        if (!attributionRole.Succeeded)
            return attributionRole;

        db.Utilisateurs.Add(new UtilisateurEntity
        {
            IdentityUserId = user.Id,
            Nom = nom,
            Prenom = prenom,
            Telephone = telephone
        });

        await db.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return IdentityResult.Success;
    }
}
