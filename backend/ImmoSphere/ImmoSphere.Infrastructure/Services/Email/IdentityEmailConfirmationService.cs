using ImmoSphere.Domain.Services.Interfaces;
using ImmoSphere.Infrastructure.Identity;
using ImmoSphere.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace ImmoSphere.Infrastructure.Services.Email;

public class IdentityEmailConfirmationService
    : IEmailConfirmationService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public IdentityEmailConfirmationService(
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    public async Task<string> GenerateConfirmationLinkAsync(
        string email)
    {
        // Récupération de l'utilisateur
        var user = await _userManager.FindByEmailAsync(email);

        if (user == null)
            throw new InvalidOperationException(
                "Utilisateur introuvable");

        // Génération du jeton de confirmation
        var token =
            await _userManager.GenerateEmailConfirmationTokenAsync(user);

        // Encodage pour l'utiliser dans une URL
        var encodedToken = Uri.EscapeDataString(token);
        var encodedUserId = Uri.EscapeDataString(user.Id);

        var baseUrl = _configuration["EmailConfirmation:ApiBaseUrl"]
                      ?? throw new InvalidOperationException(
                          "URL de confirmation non configurée");

        // Construction du lien
        return $"{baseUrl.TrimEnd('/')}/api/auth/confirm-email"
               + $"?userId={encodedUserId}"
               + $"&token={encodedToken}";
    }

    public async Task<bool> ConfirmEmailAsync(
        string userId,
        string token)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return false;

        var result = await _userManager.ConfirmEmailAsync(
            user,
            token
        );

        return result.Succeeded;
    }
}