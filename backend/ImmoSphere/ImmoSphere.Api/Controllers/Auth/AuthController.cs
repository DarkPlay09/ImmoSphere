using ImmoSphere.Api.Dtos.auth;
using ImmoSphere.Api.Security;
using ImmoSphere.Domain.Exceptions.Auth;
using ImmoSphere.Domain.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

using System.IdentityModel.Tokens.Jwt;

namespace ImmoSphere.Api.Controllers.Auth;
/**
 * Cette classe s'occupe des routes concernant l'inscription, connection et déconnection.
 *
 * Les routes pour atteindre les méthodes sont les suivantes :
 *
 *   1. Inscription
 *   Route : /api/auth/register
 *   Ayant comme paramètres :
 *      name (str),
 *      givenName (str),
 *      email (str),
 *      password (str),
 *      accountType (str),
 *      conditions (bool)
 *
 *   TODO
 *   2. Validation du code
 *   Route : /api/auth/verify-email
 *   Ayant comme paramètres :
 *      email (str),
 *      code (str)
 *
 *   TODO
 *   3. Connection
 *   Route : /api/auth/login
 *   Ayant comme paramètres :
 *      TODO
 *
*    TODO
 *   4. Déconnection
 *   Route : /api/auth/logout
 *   Ayant comme paramètres :
 *      email (str),
 *      code (str)
 */
[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IRegisterService _service;
    private readonly ILogger<AuthController> _logger;
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _environment;

    public AuthController(
        IRegisterService service,
        ILogger<AuthController> logger,
        IConfiguration configuration,
        IWebHostEnvironment environment)
    {
        _service = service;
        _logger = logger;
        _configuration = configuration;
        _environment = environment;
    }

    /**
     * Exemple de requete http
     *
     const informations = {
      name: 'Maes',
      givenName: 'Tibo',
      email: 'tibo.maes2611@gmail.com',
      password: 'Password1234$',
      accountType: 'utilisateur',
      conditions: true,
    };
     *
     */
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        try
        {
            _logger.LogInformation("Nouvelle requête : Inscription");
            await _service.CreateUserAsync(request.Name, request.GivenName, request.Email, request.Password,
                request.AccountType, request.Conditions);
            _logger.LogInformation("Utilisateur crée, mail envoyé. Fin de processus (code 200)");
            return Ok(new { message = "Register success" });
        }
        catch (RegisterException.EmailAlreadyExistsException e)
        {
            _logger.LogError("Erreur lors de l'inscirption, envoi d'un erreur");
            return Conflict(new { message = e.Message });
        }
        catch (RegisterException.ConditionsNotAcceptedException e)
        {
            _logger.LogError("Erreur lors de l'inscirption, envoi d'un erreur");
            return BadRequest(new { message = e.Message });
        }
        catch (RegisterException.InvalidPasswordException e)
        {
            _logger.LogError("Erreur lors de l'inscirption, envoi d'un erreur");
            return BadRequest(new { message = e.Message });
        }
        catch (Exception e)
        {
            _logger.LogError("Erreur lors de l'inscirption, envoi d'un erreur");
            return Problem("Une erreur interne est survenue.");
        }
    }

    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail(
        [FromBody] VerifyEmailRequestDto request)
    {
        try
        {
            _logger.LogInformation(
                "Nouvelle requête : Vérification de mail"
            );

            string? token = await _service.VerifyCodeAsync(
                request.Email,
                request.Code
            );

            if (token == null)
            {
                return BadRequest(new
                {
                    message = "Code invalide ou expiré."
                });
            }
            
            bool cookiesEnabled = _configuration.GetValue<bool>("Auth:CookiesEnabled");

            if (cookiesEnabled)
            {
                // Récupération de l'expiration du JWT existant
                var jwt = new JwtSecurityTokenHandler()
                    .ReadJwtToken(token);
                
                // Création du cookie sécurisé
                Response.Cookies.Append(
                    AuthSessionCookie.Name,
                    token,
                    new CookieOptions
                    {
                        HttpOnly = true,

                        Secure = !_environment.IsDevelopment(),

                        SameSite = SameSiteMode.Lax,

                        Path = "/",

                        Expires = new DateTimeOffset(jwt.ValidTo),

                        IsEssential = true

                    }
                );
                
                _logger.LogInformation(
                    "Compte confirmé : cookie de session créé");

                return Ok(new
                {
                    message = "Adresse e-mail confirmée."
                });
            }

            _logger.LogInformation(
                "Compte confirmé et authentification réussie"
            );

            return Ok(new
            {
                token = token,
                tokenType = "Bearer"
            });
        }
        catch (Exception e)
        {
            _logger.LogError(
                e,
                "Erreur lors de la confirmation de l'e-mail"
            );

            return Problem("Une erreur interne est survenue.");
        }
    }

    [HttpPost("login")]
    public IActionResult Login()
    {
        return Ok(new { message = "Connexion reçue" });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        return Ok(new { message = "Déconnexion reçue" });
    }
    
    [HttpGet("me")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public IActionResult GetCurrentUser()
    {
        string? userId = User.FindFirst(
            JwtRegisteredClaimNames.Email
            )?.Value;
        
        string? email = User.FindFirst(
            JwtRegisteredClaimNames.Email
            )?.Value;

        if (string.IsNullOrWhiteSpace(userId) ||
            string.IsNullOrWhiteSpace(email))
        {
            return Unauthorized(new
            {
                message = "Session invalide."
            });
        }

        return Ok(new
        {
            id = userId,
            email = email
        });
    }
}