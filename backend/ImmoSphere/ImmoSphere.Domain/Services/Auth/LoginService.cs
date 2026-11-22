using ImmoSphere.Domain.Exceptions.Auth;
using ImmoSphere.Domain.Repository;
using ImmoSphere.Domain.Services.Interfaces;

namespace ImmoSphere.Domain.Services.Auth;

public class LoginService : ILoginService
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;

    public LoginService(IUserRepository userRepository, ITokenService tokenService)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
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

    private void CheckEntries(string login, string password)
    {
        if (string.IsNullOrEmpty(login) || string.IsNullOrEmpty(password))
        {
            throw new ArgumentException("Login et/ou mot de passe invalide");
        }
    }
}