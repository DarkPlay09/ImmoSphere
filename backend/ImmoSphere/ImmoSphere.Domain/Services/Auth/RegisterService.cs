
using System.Text.RegularExpressions;
using ImmoSphere.Domain.Exceptions.Auth;
using ImmoSphere.Domain.Repository;
using ImmoSphere.Domain.Services.Interfaces;

namespace ImmoSphere.Domain.Services.Auth;

public class RegisterService : IRegisterService
{
    private readonly IUserRepository _userRepository;
    private readonly IEmailService _emailService;
    private readonly IEmailConfirmationService _emailConfirmationService;

    public RegisterService(
        IUserRepository repo,
        IEmailService emailService,
        IEmailConfirmationService emailConfirmationService)
    {
        _userRepository = repo;
        _emailService = emailService;
        _emailConfirmationService = emailConfirmationService;
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
        CheckEntries(conditions, email, password);

        // 2. Création de l'utilisateur
        await _userRepository.CreateUserAsync(
            name,
            givenName,
            email,
            password,
            accountType
        );

        // 3. Génération du lien de confirmation
        var confirmationLink =
            await _emailConfirmationService
                .GenerateConfirmationLinkAsync(email);

        // 4. Construction de l'e-mail
        var subject = "Confirmez votre compte ImmoSphere";

        var body = $"""
            <h2>Bienvenue sur ImmoSphere !</h2>
            <p>Merci de vous être inscrit sur notre plateforme.</p>
            <p>
                Pour activer votre compte, cliquez sur le lien suivant :
            </p>
            <p>
                <a href="{confirmationLink}">
                    Confirmer mon adresse e-mail
                </a>
            </p>
            <p>
                Si vous n'êtes pas à l'origine de cette inscription,
                ignorez cet e-mail.
            </p>
            """;

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
}
