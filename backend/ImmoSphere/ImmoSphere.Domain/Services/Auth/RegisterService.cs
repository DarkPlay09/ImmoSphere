using System.Text.RegularExpressions;
using ImmoSphere.Domain.Exceptions.Auth;
using ImmoSphere.Domain.Repository;
using ImmoSphere.Domain.Services.Interfaces;

namespace ImmoSphere.Domain.Services.Auth;

public class RegisterService : IRegisterService
{
    private IUserRepository _userRepository;

    public RegisterService(IUserRepository repo)
    {
        _userRepository = repo;
    }

    public async Task CreateUserAsync(
        string name,
        string givenName,
        string email,
        string password,
        string accountType,
        bool conditions)
    {
        CheckEntries(conditions, email, password);

        // 4. Créer l'utilisateur
        await _userRepository.CreateUserAsync(
            name,
            givenName,
            email,
            password,
            accountType
        );
        // 5. Evnoyer le code de confirmation
    }

    private void CheckEntries(bool conditions, string email, string password)
    {
        // 1. Vérifier les conditions d'utilisations
        if (!conditions)
        {
            throw new RegisterException.ConditionsNotAcceptedException("Les conditions n'ont pas été acceptés");
        }

        // 2. Vérifier si un compte avec ce mail existe déjà
        if (_userRepository.UserExists(email))
        {
            throw new RegisterException.EmailAlreadyExistsException($"L'utilisateur ayant comme email {email} existe déjà.");
        }
        // 3. Vérifier MDP
        if (string.IsNullOrEmpty(password) ||
            !Regex.IsMatch(password, @"^(?=.*[A-Z])(?=.*[0-9]).{8,}$"))
        {
            throw new RegisterException.InvalidPasswordException(
                "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.");
        }    }
}