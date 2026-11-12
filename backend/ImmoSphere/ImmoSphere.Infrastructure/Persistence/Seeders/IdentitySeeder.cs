using ImmoSphere.Infrastructure.Identity;
using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ImmoSphere.Infrastructure.Persistence.Seeders;

public static class IdentitySeeder
{
    // Rôles fonctionnels, insérés par Identity (AspNetRoles), pas dans l'ancienne table 'role'.
    public static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
    {
        foreach (var roleName in RoleNames.Tous)
        {
            if (await roleManager.RoleExistsAsync(roleName))
                continue;

            var result = await roleManager.CreateAsync(new IdentityRole(roleName));
            EnsureSucceeded(result, $"Création du rôle {roleName}");
        }
    }

    // Appeler UNIQUEMENT en Development et si DemoSeed:Password est défini localement.
    // Les comptes ont des adresses example.test et ne doivent pas être utilisés en production.
    public static async Task SeedDemoUsersAsync(
        UserManager<ApplicationUser> userManager,
        ApplicationDbContext db,
        string? demoPassword)
    {
        if (string.IsNullOrWhiteSpace(demoPassword))
            return; // Les rôles ont quand même été créés par SeedRolesAsync.

        var proprietaire = await EnsureUserAsync(userManager, db,
            "proprietaire.demo@example.test", demoPassword,
            "Martin", "Léa", RoleNames.ProprietaireParticulier);

        var agent = await EnsureUserAsync(userManager, db,
            "agent.demo@example.test", demoPassword,
            "Lambert", "Noah", RoleNames.AgentImmobilier);

        await EnsureUserAsync(userManager, db,
            "client.demo@example.test", demoPassword,
            "Dubois", "Emma", RoleNames.Client);
        await EnsureUserAsync(userManager, db,
            "john.doe@gmail.com", demoPassword,
            "Doe", "John", RoleNames.Client);

        // Relier l'agent à une agence fictive déjà créée par DatabaseSeeder.
        var agence = await db.Agences.SingleOrDefaultAsync(a => a.Nom == "Immo Meuse (démo)");
        if (agence != null && agent.AgenceId == null)
            agent.AgenceId = agence.Id;

        // Les biens antérieurement seedés sans propriétaire sont reliés aux profils.
        var biensDemoSansAuteur = await db.Biens
            .Where(b => b.PublieParId == null && b.Titre.EndsWith("(démo)"))
            .OrderBy(b => b.Id)
            .ToListAsync();

        for (var i = 0; i < biensDemoSansAuteur.Count; i++)
            biensDemoSansAuteur[i].PublieParId = i % 2 == 0 ? proprietaire.Id : agent.Id;

        await db.SaveChangesAsync();
    }

    private static async Task<UtilisateurEntity> EnsureUserAsync(
        UserManager<ApplicationUser> userManager,
        ApplicationDbContext db,
        string email, string password, string nom, string prenom, string role)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null)
        {
            user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true // Démonstration locale uniquement.
            };
            EnsureSucceeded(await userManager.CreateAsync(user, password),
                $"Création de l'utilisateur {email}");
        }

        if (!await userManager.IsInRoleAsync(user, role))
            EnsureSucceeded(await userManager.AddToRoleAsync(user, role),
                $"Attribution du rôle {role} à {email}");

        var profil = await db.Utilisateurs
            .SingleOrDefaultAsync(p => p.IdentityUserId == user.Id);
        if (profil is not null)
            return profil;

        profil = new UtilisateurEntity
        {
            IdentityUserId = user.Id,
            Nom = nom,
            Prenom = prenom
        };
        db.Utilisateurs.Add(profil);
        await db.SaveChangesAsync();
        return profil;
    }

    private static void EnsureSucceeded(IdentityResult result, string operation)
    {
        if (result.Succeeded)
            return;
        throw new InvalidOperationException($"{operation} : " +
            string.Join(" ; ", result.Errors.Select(e => e.Description)));
    }
}
