using ImmoSphere.Api.Dtos.Agences;
using ImmoSphere.Api.Errors;
using ImmoSphere.Domain.Exceptions;
using ImmoSphere.Domain.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ImmoSphere.Api.Controllers;

[ApiController]
[Route("api/agences")]
public class AgenceController : ControllerBase
{
    private readonly IAgenceService _agenceService;
    private readonly ILogger<AgenceController> _logger;

    public AgenceController(IAgenceService agenceService, ILogger<AgenceController> logger)
    {
        _agenceService = agenceService;
        _logger = logger;
    }

    /// <summary>Liste paginée des agences, avec recherche et tri (UC37).</summary>
    [HttpGet]
    [ProducesResponseType<AgenceSearchResultDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ApiError>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AgenceSearchResultDto>> Search(
        [FromQuery] AgenceSearchQuery query,
        CancellationToken cancellationToken)
    {
        if (!AgenceSearchQueryParser.TryParse(query, out var recherche, out var erreur))
        {
            _logger.LogInformation("Recherche d'agences refusée : {Code}", erreur.Code);
            return BadRequest(erreur);
        }

        var resultat = await _agenceService.SearchAsync(recherche, cancellationToken);

        _logger.LogInformation(
            "Recherche d'agences (nom : {Nom}, localisation : {Localisation}, région : {Region}, tri : {Tri}, page : {Page}/{NombrePages}) : {Total} résultat(s)",
            recherche.Nom,
            recherche.Localisation,
            recherche.Region,
            recherche.Tri,
            resultat.Page,
            resultat.NombrePages,
            resultat.Total);

        return Ok(AgenceDtoMapper.ToDto(resultat));
    }

    /// <summary>Profil d'une agence (UC37).</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType<AgenceDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ApiError>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AgenceDto>> GetById(int id, CancellationToken cancellationToken)
    {
        try
        {
            var agence = await _agenceService.GetByIdAsync(id, cancellationToken);
            return Ok(AgenceDtoMapper.ToDto(agence));
        }
        catch (AgenceNotFoundException ex)
        {
            _logger.LogWarning("Agence {AgenceId} introuvable", ex.AgenceId);
            return NotFound(new ApiError(ApiErrorCodes.AgenceNotFound, ex.Message));
        }
    }
}
