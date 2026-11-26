using System.Security.Cryptography;
using ImmoSphere.Domain.Exceptions.Auth;
using ImmoSphere.Domain.Repository;
using ImmoSphere.Domain.Services.Interfaces;

namespace ImmoSphere.Domain.Services.Auth;

public class LoginService : ILoginService
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;
    private readonly IPasswordResetRepository _passwordResetRepository;
    private readonly IEmailService _emailService;

    public LoginService(
        IUserRepository userRepository,
        ITokenService tokenService,
        IPasswordResetRepository passwordResetRepository,
        IEmailService emailService)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
        _passwordResetRepository = passwordResetRepository;
        _emailService = emailService;
    }

    public async Task<string?> Login(string login, string password, bool remember)
    {
        // 1. Vérifier les entrées
        CheckEntries(login, password);

        // 2. Voir si un utilisateur avec ce login existe
        if (!_userRepository.UserExists(login))
        {
            throw new LoginException.UserNotExist($"L'utilisateur {login} n'existe pas, connexion impossible");
        }

        // 3. Voir si mot de passe est correct
        if (!await _userRepository.CheckPassFor(login, password))
        {
            throw new LoginException.WrongPassword("Mot de passe incorrect, connexion impossible");
        }

        // 4. Retourner token si remeber=true sinon retourner rien
        return await _tokenService.GenerateTokenAsync(login, remember);
    }

    /**
     * Retourne vrai si le mail a bien été envoyé, faux sinon
     *
     */

    public async Task<bool> SendVerificationEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Adresse e-mail manquante.");

        // Génération sécurisée d'un code à 6 chiffres
        string code = RandomNumberGenerator
            .GetInt32(0, 1_000_000)
            .ToString("D6");

        bool created = await _passwordResetRepository
            .SaveCodeAsync(email, code);

        // Ne pas révéler si l'utilisateur existe
        if (!created)
            return false;

        await _emailService.SendEmailAsync(
            email,
            "ImmoSphère - Réinitialisation du mot de passe",
            $"Votre code de réinitialisation est : {code}\n" +
            "Ce code expire dans 10 minutes."
        );
        return true;
    }

    public Task<bool> VerifyPasswordResetCodeAsync(
        string email,
        string code)
    {
        return _passwordResetRepository.VerifyCodeAsync(email, code);
    }

    public Task<PasswordResetResult> ResetPasswordAsync(
        string email,
        string code,
        string newPassword)
    {
        return _passwordResetRepository.ResetPasswordAsync(
            email, code, newPassword);
    }


    private void CheckEntries(string login, string password)
    {
        if (string.IsNullOrEmpty(login) || string.IsNullOrEmpty(password))
        {
            throw new ArgumentException("Login et/ou mot de passe invalide");
        }
    }
}