using System.Text.Json.Nodes;
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
    public ActionResult<Bien> GetBienById(int id)
    {
        try
        {
            Bien bien = _bienService.getBienById(id);
            return Ok(bien);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}