using System.Text.RegularExpressions;
using ImmoSphere.Domain.Exceptions.Auth;
using ImmoSphere.Domain.Repository;
using ImmoSphere.Domain.Services.Interfaces;
using Microsoft.Extensions.Logging;

namespace ImmoSphere.Domain.Services.Auth;

public class RegisterService : IRegisterService
{
    private readonly IUserRepository _userRepository;
    private readonly IEmailService _emailService;
    private readonly IEmailConfirmationService _emailConfirmationService;
    private readonly ITokenService _tokenService;
    private readonly ILogger<RegisterService> _logger;

    public RegisterService(
        IUserRepository repo,
        IEmailService emailService,
        IEmailConfirmationService emailConfirmationService,
        ITokenService tokenService,
        ILogger<RegisterService> logger)
    {
        _userRepository = repo;
        _emailService = emailService;
        _emailConfirmationService = emailConfirmationService;
        _tokenService = tokenService;
        _logger =  logger;
    }

    public async Task CreateUserAsync(
        string name,
        string givenName,
        string email,
        string password,
        string accountType,
        bool conditions)
    {
        // 1. Vérification des données
        _logger.LogInformation("Vérification des entrées");
        CheckEntries(conditions, email, password);
        _logger.LogInformation("Les informations sont correctes");

        // 2. Création de l'utilisateur
        var userId = await _userRepository.CreateUserAsync(
            name,
            givenName,
            email,
            password,
            accountType
        );
        _logger.LogInformation($"L'utilisateur {email} à été crée");
        // 3. Génération du code
        _logger.LogInformation("Génération et envoi du code par mail");
        var code = await _emailConfirmationService.GenerateCodeAsync(userId);

        // 4. Construction de l'e-mail
        var subject = "Confirmez votre compte ImmoSphere";
        var body = GenerateMail(code);

        // 5. Envoi de l'e-mail
        await _emailService.SendEmailAsync(
            email,
            subject,
            body
        );
    }

    public async Task<string?> VerifyCodeAsync(string email, string code)
    {
        // 1. Vérifier et confirmer l'adresse e-mail
        bool isValid = await _emailConfirmationService.VerifyCodeAsync(
            email,
            code
        );

        if (!isValid)
        {
            _logger.LogWarning(
                "Code de confirmation invalide pour {Email}",
                email
            );

            return null;
        }

        // 2. Générer un token d'authentification
        string token = await _tokenService.GenerateTokenAsync(email,false);

        _logger.LogInformation(
            "Adresse confirmée et token généré pour {Email}",
            email
        );

        return token;
    }

    private void CheckEntries(
        bool conditions,
        string email,
        string password)
    {
        if (!conditions)
        {
            throw new RegisterException.ConditionsNotAcceptedException(
                "Les conditions n'ont pas été acceptées");
        }

        if (_userRepository.UserExists(email))
        {
            throw new RegisterException.EmailAlreadyExistsException(
                $"L'utilisateur ayant comme email {email} existe déjà.");
        }

        if (string.IsNullOrEmpty(password) ||
            !Regex.IsMatch(
                password,
                @"^(?=.*[A-Z])(?=.*[0-9]).{8,}$"))
        {
            throw new RegisterException.InvalidPasswordException(
                "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.");
        }
    }

    private string GenerateMail(string code)
    {
        var body = $"""
                    <h2>Bienvenue sur ImmoSphere !</h2>
                    <p>Merci de vous être inscrit sur notre plateforme.</p>
                    <p>
                        Vous êtes en train de finaliser
                        la création de votre compte !
                    </p>
                    <p>
                        Votre code de confirmation est :
                        <strong>{code}</strong>
                    </p>
                    <p>
                        Ce code est valable pendant 10 minutes.
                    </p>
                    <p>
                        Si vous n'êtes pas à l'origine de cette
                        inscription, ignorez cet e-mail.
                    </p>
                    """;

        return body;
    }

    public async Task ResendConfirmationCodeAsync(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return;
        }

        email = email.Trim();

        var userId = await _userRepository
            .FindUnconfirmedUserIdAsync(email);

        if (userId is null)
        {
            return;
        }

        var code = await _emailConfirmationService
            .GenerateResendCodeAsync(userId);

        if (code is null)
        {
            return;
        }

        const string subject = "Confirmez votre compte ImmoSphere";

        var body = GenerateMail(code);

        await _emailService.SendEmailAsync(
            email,
            subject,
            body);
        
        _logger.LogInformation(
            "Nouveau code de confirmation envoyé pour l'utilisateur {UserId}",
            userId);
    }
}