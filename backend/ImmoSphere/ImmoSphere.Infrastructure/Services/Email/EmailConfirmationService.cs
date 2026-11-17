using System.Security.Cryptography;
using System.Text;
using ImmoSphere.Domain.Services.Interfaces;
using ImmoSphere.Infrastructure.Persistence;
using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ImmoSphere.Infrastructure.Services.Email;

public class EmailConfirmationService : IEmailConfirmationService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly byte[] _hmacKey;
    private readonly UserManager<ApplicationUser> _userManager;

    public EmailConfirmationService(
        ApplicationDbContext dbContext,
        IConfiguration configuration,
        UserManager<ApplicationUser> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;

        var secret = configuration["EmailConfirmation:HmacKey"]
                     ?? throw new InvalidOperationException(
                         "Clé HMAC de confirmation manquante.");

        _hmacKey = Convert.FromBase64String(secret);

        if (_hmacKey.Length < 32)
            throw new InvalidOperationException(
                "La clé HMAC doit contenir au moins 32 octets.");
    }

    public async Task<string> GenerateCodeAsync(string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            throw new ArgumentException("UserId invalide.", nameof(userId));

        // 1. Générer le code
        var code = RandomNumberGenerator
            .GetInt32(0, 1_000_000)
            .ToString("D6");

        // 2. Calculer l'empreinte
        var codeHash = ComputeCodeHash(userId, code);

        // 3. Recherche d'un code existant
        var entity = await _dbContext.EmailConfirmationCodes
            .SingleOrDefaultAsync(c => c.UserId == userId);

        DateTime now = DateTime.UtcNow;

        if (entity == null)
        {
            // 4. Création du code
            entity = new EmailConfirmationCodeEntity
            {
                UserId = userId,
                CodeHash = codeHash,
                CreatedAtUtc = now,
                ExpiresAtUtc = now.AddMinutes(10),
                Attempts = 0,
                IsUsed = false
            };

            _dbContext.EmailConfirmationCodes.Add(entity);
        }
        else
        {
            // 5. Remplacement de l'ancien code
            entity.CodeHash = codeHash;
            entity.CreatedAtUtc = now;
            entity.ExpiresAtUtc = now.AddMinutes(10);
            entity.Attempts = 0;
            entity.IsUsed = false;
        }

        // 6. Sauvegarde dans PostgreSQL
        await _dbContext.SaveChangesAsync();

        // 7. Retour du code pour l'envoi par e-mail
        return code;
    }

    public async Task<bool> VerifyCodeAsync(string email, string code)
    {
        if (string.IsNullOrWhiteSpace(email) ||
            string.IsNullOrWhiteSpace(code))
            return false;

        // 1. Recherche de l'utilisateur
        var user = await _userManager.FindByEmailAsync(email.Trim());

        if (user == null || user.EmailConfirmed)
            return false;

        // 2. Recherche du code en base
        var confirmation = await _dbContext.EmailConfirmationCodes
            .SingleOrDefaultAsync(c => c.UserId == user.Id);

        if (confirmation == null ||
            confirmation.IsUsed ||
            confirmation.ExpiresAtUtc <= DateTime.UtcNow ||
            confirmation.Attempts >= 5)
            return false;

        // 3. Comparaison sécurisée des empreintes
        var expectedHash = Convert.FromHexString(confirmation.CodeHash);
        var receivedHash = Convert.FromHexString(
            ComputeCodeHash(user.Id, code)
        );

        bool isValid = CryptographicOperations.FixedTimeEquals(
            expectedHash,
            receivedHash
        );

        if (!isValid)
        {
            confirmation.Attempts++;
            await _dbContext.SaveChangesAsync();
            return false;
        }

        // 4. Activation du compte
        user.EmailConfirmed = true;
        confirmation.IsUsed = true;

        // Les deux entités sont suivies par le même DbContext
        await _dbContext.SaveChangesAsync();

        return true;
    }

    private string ComputeCodeHash(string userId, string code)
    {
        var data = Encoding.UTF8.GetBytes($"{userId}:{code}");

        var hash = HMACSHA256.HashData(_hmacKey, data);

        return Convert.ToHexString(hash);
    }

}