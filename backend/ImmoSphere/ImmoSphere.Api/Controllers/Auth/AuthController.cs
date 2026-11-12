using ImmoSphere.Api.Dtos.auth;
using ImmoSphere.Domain.Exceptions.Auth;
using ImmoSphere.Domain.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ImmoSphere.Api.Controllers.Auth;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    IRegisterService _service;

    public AuthController(IRegisterService service)
    {
        _service = service;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        try
        {
            await _service.CreateUserAsync(request.Name, request.GivenName, request.Email, request.Pass,
                request.AccountType, request.Conditions);
            return Ok(new { message = "Register success" });
        }
        catch (RegisterException.EmailAlreadyExistsException e)
        {
            return Conflict(new { message = e.Message });
        }
        catch (RegisterException.ConditionsNotAcceptedException e)
        {
            return BadRequest(new { message = e.Message });
        }
        catch (RegisterException.InvalidPasswordException e)
        {
            return BadRequest(new { message = e.Message });
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
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

    [HttpPost("verify-email")]
    public IActionResult VerifyEmail()
    {
        return Ok(new { message = "Vérification reçue" });
    }
}