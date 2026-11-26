using ImmoSphere.Api.Dtos.auth;
using ImmoSphere.Api.Security;
using ImmoSphere.Domain.Exceptions.Auth;
using ImmoSphere.Domain.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using System.IdentityModel.Tokens.Jwt;
using ImmoSphere.Domain.Repository;
using Microsoft.AspNetCore.Identity.Data;

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
 *   2. Validation du code
 *   Route : /api/auth/verify-email
 *   Ayant comme paramètres :
 *      email (str),
 *      code (str)
 *
 *   3. Connection
 *   Route : /api/auth/login
 *   Ayant comme paramètres :
 *      email (str)
 *      password (str)
 *      rememberMe (bool)
 */
[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IRegisterService _registerService;
    private readonly ILoginService _loginService;
    private readonly ILogger<AuthController> _logger;
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _environment;

    public AuthController(
        IRegisterService service,
        ILoginService loginService,
        ILogger<AuthController> logger,
        IConfiguration configuration,
        IWebHostEnvironment environment)
    {
        _registerService = service;
        _loginService = loginService;
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
            await _registerService.CreateUserAsync(request.Name, request.GivenName, request.Email, request.Password,
                request.AccountType, request.Conditions);
            _logger.LogInformation("Utilisateur crée, mail envoyé. Fin de processus (code 200)");
            return Ok(new { message = "Register success" });
        }
        catch (RegisterException.EmailAlreadyExistsException e)
        {
            _logger.LogWarning(
                e,
                "Inscription refusée : adresse e-mail déjà utilisée"
            );

            return Conflict(new { message = e.Message });
        }
        catch (RegisterException.ConditionsNotAcceptedException e)
        {
            _logger.LogWarning(
                e,
                "Inscription refusée : conditions non acceptées"
            );

            return BadRequest(new { message = e.Message });
        }
        catch (RegisterException.InvalidPasswordException e)
        {
            _logger.LogWarning(
                e,
                "Inscription refusée : mot de passe invalide"
            );

            return BadRequest(new { message = e.Message });
        }
        catch (Exception e)
        {
            _logger.LogError(
                e,
                "Erreur inattendue lors de l'inscription"
            );

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

            string? token = await _registerService.VerifyCodeAsync(
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

            bool cookiesEnabled = _configuration.GetValue<bool>("Auth:SessionCookiesEnabled");

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

    [HttpPost("resend-confirmation")]
    [EnableRateLimiting("resend-confirmation")]
    public async Task<IActionResult> ResendConfirmation(
        [FromBody] ResendConfirmationRequestDto request)
    {
        try
        {
            await _registerService.ResendConfirmationCodeAsync(request.Email);
        }
        catch (Exception e)
        {
            _logger.LogError(
                e,
                "Erreur lors du renvoi d'un code de confirmation");
        }

        return Ok(new
        {
            message = "Si cette adresse correspond à un compte non confirmé, " +
                      "un nouveau code vous sera envoyé lorsque le renvoi sera possible."
        });
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        try
        {
            _logger.LogInformation("Nouvelle requête : Connexion");

            // 1. Authentifier l'utilisateur et récupérer son JWT
            string? token = await _loginService.Login(
                request.Email,
                request.Password,
                request.RememberMe
            );

            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized(new
                {
                    message = "Connexion impossible."
                });
            }

            // 2. Vérifier si les cookies sont activés
            bool cookiesEnabled = _configuration.GetValue<bool>(
                "Auth:SessionCookiesEnabled"
            );

            if (cookiesEnabled)
            {
                // 3. Préparer le cookie de session
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = !_environment.IsDevelopment(),
                    SameSite = SameSiteMode.Lax,
                    Path = "/",
                    IsEssential = true
                };

                // 4. Rendre le cookie persistant si RememberMe = true
                if (request.RememberMe)
                {
                    var jwt = new JwtSecurityTokenHandler()
                        .ReadJwtToken(token);

                    cookieOptions.Expires = new DateTimeOffset(jwt.ValidTo);
                }

                // 5. Envoyer le cookie
                Response.Cookies.Append(
                    AuthSessionCookie.Name,
                    token,
                    cookieOptions
                );

                _logger.LogInformation("Connexion réussie : cookie créé");

                return Ok(new
                {
                    message = "Connexion réussie."
                });
            }

            // 6. Si les cookies sont désactivés, retourner le JWT
            return Ok(new
            {
                token,
                tokenType = "Bearer"
            });
        }
        catch (LoginException.UserNotExist e)
        {
            _logger.LogWarning(e, "Connexion refusée : utilisateur inexistant");

            return Unauthorized(new
            {
                message = "E-mail ou mot de passe incorrect."
            });
        }
        catch (LoginException.WrongPassword e)
        {
            _logger.LogWarning(e, "Connexion refusée : mot de passe incorrect");

            return Unauthorized(new
            {
                message = "E-mail ou mot de passe incorrect."
            });
        }
        catch (ArgumentException e)
        {
            _logger.LogWarning(e, "Connexion refusée : données invalides");

            return BadRequest(new
            {
                message = "E-mail ou mot de passe manquant."
            });
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Erreur serveur lors de la connexion");

            return Problem("Une erreur interne est survenue.");
        }
    }


    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete(
            AuthSessionCookie.Name,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.Lax,
                Path = "/",
            });

        return NoContent();
    }

    [HttpGet("me")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public IActionResult GetCurrentUser()
    {
        string? userId = User.FindFirst(
            JwtRegisteredClaimNames.Sub
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

    /**
     *   Route : /api/auth/verify-email-pswd
     *   Ayant comme paramètres :
     *      email (str)
     *
     *   Cette méthode retourne un boolean,
     *   vrai si le mail a été envoyé (on peut passer à l'écran suivante),
     *   faux sinon
     */
    [HttpPost("verify-email-pswd")]
    [EnableRateLimiting("resend-confirmation")]
    public async Task<IActionResult> VerifyEmailPswd(
        [FromBody] ResetPasswordRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { message = "E-mail requis." });

        try
        {
            bool result = await _loginService.SendVerificationEmail(request.Email);

            _logger.LogInformation(
                "Demande de réinitialisation traitée. Envoi déclenché : {Result}",
                result);
        }
        catch (Exception e)
        {
            _logger.LogError(e,
                "Erreur lors de la demande de réinitialisation");

            return Problem("Une erreur interne est survenue.");
        }

        return Ok(new
        {
            message = "Si cette adresse correspond à un compte, " +
                      "un code de réinitialisation sera envoyé."
        });
    }

    /**
     *   Route : /api/auth/verify-reset-code
     *   Ayant comme paramètres :
     *      email (str)
     *      code (str)
     *
     *   Il faut appeler cette route lorsque l'utilisateur entre le code de confirmation
     *   envoyé par mail (Réinitialisation du mot de passe)
     */
    [HttpPost("verify-reset-code")]
    public async Task<IActionResult> VerifyResetCode(
        [FromBody] VerifyResetCodeRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) ||
            request.Code == null ||
            request.Code.Length != 6 ||
            !request.Code.All(char.IsAsciiDigit))
        {
            return BadRequest(new { message = "Données invalides." });
        }

        try
        {
            bool valid = await _loginService
                .VerifyPasswordResetCodeAsync(
                    request.Email, request.Code);

            if (!valid)
                return BadRequest(new
                {
                    message = "Code invalide ou expiré."
                });

            return Ok(new { message = "Code valide." });
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Erreur de vérification du code");
            return Problem("Une erreur interne est survenue.");
        }
    }

    /**
     *   Route : /api/auth/reset-password
     *   Ayant comme paramètres :
     *      email (str)
     *      code (str)
     *      newpassword (str)
     *
     *   Il faut appeler cette route quand l'utilisateur a entré son nouveau mots de passe (ainsi que sa répétition)
     */
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(
        [FromBody] ConfirmResetPasswordRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.NewPassword) ||
            request.Code == null ||
            request.Code.Length != 6 ||
            !request.Code.All(char.IsAsciiDigit))
        {
            return BadRequest(new { message = "Données invalides." });
        }

        try
        {
            var result = await _loginService.ResetPasswordAsync(
                request.Email,
                request.Code,
                request.NewPassword);

            return result switch
            {
                PasswordResetResult.Success => Ok(new
                {
                    message = "Mot de passe modifié avec succès."
                }),

                PasswordResetResult.InvalidCode => BadRequest(new
                {
                    message = "Code invalide ou expiré."
                }),

                PasswordResetResult.InvalidPassword => BadRequest(new
                {
                    message = "Le nouveau mot de passe ne respecte " +
                              "pas les règles de sécurité."
                }),

                _ => Problem("Une erreur interne est survenue.")
            };
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Erreur de réinitialisation");
            return Problem("Une erreur interne est survenue.");
        }
    }
}