using ImmoSphere.Domain.Core.Bien;
using ImmoSphere.Domain.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ImmoSphere.Api.Controllers;

[ApiController]
[Route("api/biens")]
public class BienController : ControllerBase
{
    private readonly IBienService _bienService;

    public BienController(IBienService bienService)
    {
        _bienService = bienService;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Bien>> GetBienByIdAsync(int id, CancellationToken cancellationToken)
    {
        try
        {
            Bien bien = await _bienService.GetBienByIdAsync(id, cancellationToken);
            return Ok(bien);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}