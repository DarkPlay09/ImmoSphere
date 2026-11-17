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
    private readonly ILogger<RegisterService> _logger;

    public RegisterService(
        IUserRepository repo,
        IEmailService emailService,
        IEmailConfirmationService emailConfirmationService,
        ILogger<RegisterService> logger)
    {
        _userRepository = repo;
        _emailService = emailService;
        _emailConfirmationService = emailConfirmationService;
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
}