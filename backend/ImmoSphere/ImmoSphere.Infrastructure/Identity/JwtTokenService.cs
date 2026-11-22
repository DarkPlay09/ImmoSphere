using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using ImmoSphere.Domain.Services.Interfaces;
using ImmoSphere.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace ImmoSphere.Infrastructure.Identity;

public class JwtTokenService : ITokenService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    private const int LIVE_TIME_TOKEN_WITH_REMEMBER_IN_DAYS = 30;
    private const int LIVE_TIME_TOKEN_WITHOUT_REMEMBER_IN_DAYS = 1;


    public JwtTokenService(
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    public async Task<string> GenerateTokenAsync(string email, bool remeber)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user == null || !user.EmailConfirmed)
            throw new InvalidOperationException(
                "L'utilisateur n'est pas autorisé à se connecter.");

        var roles = await _userManager.GetRolesAsync(user);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email!),
            new(ClaimTypes.NameIdentifier, user.Id),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = Convert.FromBase64String(
            _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("Clé JWT manquante.")
        );

        if (key.Length < 32)
            throw new InvalidOperationException("Clé JWT trop courte.");

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: remeber ? DateTime.UtcNow.AddDays(LIVE_TIME_TOKEN_WITH_REMEMBER_IN_DAYS)
                : DateTime.UtcNow.AddDays(LIVE_TIME_TOKEN_WITHOUT_REMEMBER_IN_DAYS),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}