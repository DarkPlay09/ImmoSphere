using System.IdentityModel.Tokens.Jwt;
using ImmoSphere.Domain.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ImmoSphere.Api.Controllers;

[ApiController]
[Route("api/favoris")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class FavorisController : ControllerBase
{
    private readonly IFavoriService _service;

    public FavorisController(IFavoriService service)
    {
        _service = service;
    }

    [HttpGet]
    public Task<IActionResult> GetFavoris(
        CancellationToken cancellationToken)
    {
        return ExecuteAsync(async identityUserId =>
        {
            var bienIds = await _service.GetBienIdsAsync(
                identityUserId,
                cancellationToken);

            return Ok(bienIds);
        });
    }

    [HttpGet("{bienId:int}")]
    public Task<IActionResult> GetFavori(
        int bienId,
        CancellationToken cancellationToken)
    {
        return ExecuteAsync(async identityUserId =>
        {
            var isFavorite = await _service.IsFavoriteAsync(
                identityUserId,
                bienId,
                cancellationToken);

            return Ok(new
            {
                bienId,
                isFavorite
            });
        });
    }

    [HttpPut("{bienId:int}")]
    public Task<IActionResult> AddFavori(
        int bienId,
        CancellationToken cancellationToken)
    {
        return ExecuteAsync(async identityUserId =>
        {
            await _service.AddAsync(
                identityUserId,
                bienId,
                cancellationToken);

            return NoContent();
        });
    }

    [HttpDelete("{bienId:int}")]
    public Task<IActionResult> RemoveFavori(
        int bienId,
        CancellationToken cancellationToken)
    {
        return ExecuteAsync(async identityUserId =>
        {
            await _service.RemoveAsync(
                identityUserId,
                bienId,
                cancellationToken);

            return NoContent();
        });
    }

    private async Task<IActionResult> ExecuteAsync(
        Func<string, Task<IActionResult>> action)
    {
        var identityUserId = User.FindFirst(
            JwtRegisteredClaimNames.Sub)?.Value;

        if (string.IsNullOrWhiteSpace(identityUserId))
        {
            return Unauthorized(new
            {
                message = "Session invalide."
            });
        }

        try
        {
            return await action(identityUserId);
        }
        catch (UnauthorizedAccessException exception)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                new { message = exception.Message });
        }
        catch (ArgumentOutOfRangeException exception)
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
        catch (KeyNotFoundException exception)
        {
            return NotFound(new
            {
                message = exception.Message
            });
        }
    }
}