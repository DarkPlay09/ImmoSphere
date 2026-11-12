using ImmoSphere.Domain.Repository;
using ImmoSphere.Infrastructure.Identity;
using ImmoSphere.Infrastructure.Persistence;
using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace ImmoSphere.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ILogger<BienRepository> _logger;
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public UserRepository(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        ILogger<BienRepository> logger)
    {
        _logger = logger;
        _context = context;
        _userManager = userManager;
    }

    public bool UserExists(string email)
    {
        string normalizedEmail = email.Trim().ToUpperInvariant();

        return _context.Users
            .Any(u => u.NormalizedEmail == normalizedEmail);
    }

    public async Task CreateUserAsync(
        string name,
        string givenName,
        string email,
        string password,
        string accountType)
    {
        // 1. Déterminer le rôle
        string role = accountType.Trim().ToLowerInvariant() switch
        {
            "utilisateur" => RoleNames.Client,
            "agent" => RoleNames.AgentImmobilier,
            "notaire" => RoleNames.Notaire,
            _ => throw new ArgumentException("Type de compte invalide.")
        };

        // 2. Démarrer une transaction
        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        // 3. Créer l'utilisateur Identity
        var user = new ApplicationUser
        {
            UserName = email.Trim(),
            Email = email.Trim(),
            EmailConfirmed = false
        };

        var result = await _userManager.CreateAsync(user, password);

        if (!result.Succeeded)
        {
            throw new InvalidOperationException(
                string.Join("; ", result.Errors.Select(e => e.Description))
            );
        }

        // 4. Attribuer le rôle
        var roleResult = await _userManager.AddToRoleAsync(user, role);

        if (!roleResult.Succeeded)
        {
            throw new InvalidOperationException(
                string.Join("; ", roleResult.Errors.Select(e => e.Description))
            );
        }

        // 5. Créer le profil métier
        var profil = new UtilisateurEntity
        {
            IdentityUserId = user.Id,
            Nom = name.Trim(),
            Prenom = givenName.Trim()
        };

        _context.Utilisateurs.Add(profil);

        await _context.SaveChangesAsync();

        // 6. Valider la transaction
        await transaction.CommitAsync();

        _logger.LogInformation(
            "Utilisateur créé avec succès : {Email}", email);
    }
}