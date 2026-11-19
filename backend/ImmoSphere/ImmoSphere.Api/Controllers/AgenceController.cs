using ImmoSphere.Api.Dtos.Agences;
using ImmoSphere.Api.Errors;
using ImmoSphere.Domain.Core.Agence;
using ImmoSphere.Domain.Exceptions;
using ImmoSphere.Domain.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ImmoSphere.Api.Controllers;

[ApiController]
[Route("api/agences")]
public class AgenceController : ControllerBase
{
    private readonly IAgenceService _agenceService;

    public AgenceController(IAgenceService agenceService)
    {
        _agenceService = agenceService;
    }

    /// <summary>Liste paginée des agences (UC37).</summary>
    /// <param name="name">Recherche dans le nom.</param>
    /// <param name="location">Ville ou code postal (« Liège », « 4000 », « Liège, 4000 »).</param>
    /// <param name="region">all | brussels | flanders | wallonia</param>
    /// <param name="sort">relevance | name | rating</param>
    /// <param name="page">Page à partir de 1, ramenée dans les bornes.</param>
    /// <param name="pageSize">Agences par page (1 à 50, 6 par défaut).</param>
    [HttpGet]
    [ProducesResponseType<AgenceSearchResultDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ApiError>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AgenceSearchResultDto>> Rechercher(
        [FromQuery] string? name,
        [FromQuery] string? location,
        [FromQuery] string? region,
        [FromQuery] string? sort,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = AgenceRecherche.TailleParDefaut,
        CancellationToken cancellationToken = default)
    {
        if (!AgenceDtoMapper.TryParseRegion(region, out Region? regionRecherchee))
        {
            return BadRequest(new ApiError(
                ApiErrorCodes.InvalidRegion,
                "La région doit valoir all, brussels, flanders ou wallonia."));
        }

        if (!AgenceDtoMapper.TryParseSort(sort, out AgenceTri tri))
        {
            return BadRequest(new ApiError(
                ApiErrorCodes.InvalidSort,
                "Le tri doit valoir relevance, name ou rating."));
        }

        var resultat = await _agenceService.RechercherAsync(
            new AgenceRecherche
            {
                Nom = name,
                Localisation = location,
                Region = regionRecherchee,
                Tri = tri,
                Page = page,
                TaillePage = pageSize,
            },
            cancellationToken);

        return Ok(AgenceDtoMapper.ToDto(resultat));
    }

    /// <summary>Profil d'une agence (UC37).</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType<AgenceDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ApiError>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AgenceDto>> ObtenirParId(int id, CancellationToken cancellationToken)
    {
        try
        {
            var agence = await _agenceService.ObtenirParIdAsync(id, cancellationToken);
            return Ok(AgenceDtoMapper.ToDto(agence));
        }
        catch (AgenceNotFoundException ex)
        {
            return NotFound(new ApiError(ApiErrorCodes.AgenceNotFound, ex.Message));
        }
    }
}
