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
    
    
    // ==========================================
    // RECHERCHE DES BIENS
    // ==========================================

    [HttpGet]
    public async Task<ActionResult<RechercheBiensResponseDto>> SearchAsync(
        [FromQuery] RechercheBiensQueryDto request,
        CancellationToken cancellationToken)
    {
        var criteres = new CriteresRechercheBiens
        {
            Recherche = request.Recherche,
            Localite = request.Localite,
            CodePostal = request.CodePostal,

            ProvinceId = request.ProvinceId,
            TypeTransactionId = request.TypeTransactionId,
            TypeBienId = request.TypeBienId,
            PebBienId = request.PebBienId,
            EtatId = request.EtatId,

            PrixMin = request.PrixMin,
            PrixMax = request.PrixMax,

            SurfaceMin = request.SurfaceMin,
            SurfaceMax = request.SurfaceMax,

            NbChambresMin = request.NbChambresMin,
            NbSdbMin = request.NbSdbMin,

            Garage = request.Garage,
            Parking = request.Parking,
            Jardin = request.Jardin,
            Terrasse = request.Terrasse,
            Balcon = request.Balcon,
            Ascenseur = request.Ascenseur,
            Piscine = request.Piscine,

            Tri = request.Tri,
            Page = request.Page,
            TaillePage = request.TaillePage
        };
        
        // Recherche dans PostgreSQL.
        ResultatRechercheBiens resultat = await _bienService.SearchAsync(criteres, cancellationToken);
        
        // Conversion vers le DTO HTTP.
        RechercheBiensResponseDto response = BienResponseMapper.ToSearchResponseDto(resultat);
        
        return Ok(response);
    }
    
    
    // ==========================================
    // DÉTAIL D'UN BIEN
    // ==========================================
    
    [HttpGet("{id:int}")]
    public async Task<ActionResult<BienDetailResponseDto>> GetPublishedBienByIdAsync(int id, CancellationToken cancellationToken)
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