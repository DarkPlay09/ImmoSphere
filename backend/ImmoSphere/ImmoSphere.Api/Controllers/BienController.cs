using ImmoSphere.Domain.Core.Bien;
using ImmoSphere.Domain.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using ImmoSphere.Api.Dtos.Biens;
using ImmoSphere.Api.Mappers;

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
    public async Task<ActionResult<BienDetailResponseDto>> GetBienByIdAsync(int id, CancellationToken cancellationToken)
    {
        try
        {
            Bien bien = await _bienService.GetPublishedBienByIdAsync(
                id,
                cancellationToken
            );

            BienDetailResponseDto response =
                BienResponseMapper.ToDetailResponseDto(bien);

            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}