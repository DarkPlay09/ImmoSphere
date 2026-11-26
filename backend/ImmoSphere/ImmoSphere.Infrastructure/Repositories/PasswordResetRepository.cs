
using System.Security.Cryptography;
using System.Text;
using ImmoSphere.Domain.Repository;
using ImmoSphere.Infrastructure.Identity;
using ImmoSphere.Infrastructure.Persistence;
using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ImmoSphere.Infrastructure.Repositories;

public class PasswordResetRepository : IPasswordResetRepository
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;
    private readonly byte[] _secret;

    public PasswordResetRepository(
        UserManager<ApplicationUser> userManager,
        ApplicationDbContext context,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _context = context;

        var secret = configuration["Auth:PasswordResetPepper"];

        if (string.IsNullOrWhiteSpace(secret) || secret.Length < 32)
            throw new InvalidOperationException(
                "Auth:PasswordResetPepper doit contenir au moins 32 caractères.");

        _secret = Encoding.UTF8.GetBytes(secret);
    }

    public async Task<bool> SaveCodeAsync(string email, string code)
    {
        var user = await _userManager.FindByEmailAsync(email.Trim());

        if (user == null)
            return false;

        var now = DateTime.UtcNow;

        var entry = await _context.PasswordResetCodes
            .FindAsync(user.Id);

        // Un renvoi maximum par minute
        if (entry != null &&
            !entry.IsUsed &&
            entry.CreatedAtUtc > now.AddMinutes(-1))
            return false;

        if (entry == null)
        {
            entry = new PasswordResetCodeEntity
            {
                UserId = user.Id
            };

            _context.PasswordResetCodes.Add(entry);
        }

        entry.CodeHash = ComputeHash(user.Id, code);
        entry.CreatedAtUtc = now;
        entry.ExpiresAtUtc = now.AddMinutes(10);
        entry.Attempts = 0;
        entry.IsUsed = false;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> VerifyCodeAsync(string email, string code)
    {
        var user = await _userManager.FindByEmailAsync(email.Trim());

        if (user == null)
            return false;

        return await GetValidCodeAsync(user, code) != null;
    }

    public async Task<PasswordResetResult> ResetPasswordAsync(
        string email,
        string code,
        string newPassword)
    {
        var user = await _userManager.FindByEmailAsync(email.Trim());

        if (user == null)
            return PasswordResetResult.InvalidCode;

        var entry = await GetValidCodeAsync(user, code);

        if (entry == null)
            return PasswordResetResult.InvalidCode;

        // Identity se charge de valider et de hacher le mot de passe
        var token = await _userManager
            .GeneratePasswordResetTokenAsync(user);

        var result = await _userManager
            .ResetPasswordAsync(user, token, newPassword);

        if (!result.Succeeded)
            return PasswordResetResult.InvalidPassword;

        entry.IsUsed = true;
        await _context.SaveChangesAsync();

        return PasswordResetResult.Success;
    }

    private async Task<PasswordResetCodeEntity?> GetValidCodeAsync(
        ApplicationUser user,
        string code)
    {
        var entry = await _context.PasswordResetCodes
            .FindAsync(user.Id);

        if (entry == null ||
            entry.IsUsed ||
            entry.ExpiresAtUtc <= DateTime.UtcNow ||
            entry.Attempts >= 5)
            return null;

        var expected = Convert.FromHexString(entry.CodeHash);
        var actual = ComputeHashBytes(user.Id, code);

        bool isValid = CryptographicOperations.FixedTimeEquals(
            expected, actual);

        if (!isValid)
        {
            entry.Attempts++;
            await _context.SaveChangesAsync();
            return null;
        }

        return entry;
    }

    private string ComputeHash(string userId, string code)
    {
        return Convert.ToHexString(ComputeHashBytes(userId, code));
    }

    private byte[] ComputeHashBytes(string userId, string code)
    {
        var data = Encoding.UTF8.GetBytes(
            $"password-reset:{userId}:{code}");

        return HMACSHA256.HashData(_secret, data);
    }
}
