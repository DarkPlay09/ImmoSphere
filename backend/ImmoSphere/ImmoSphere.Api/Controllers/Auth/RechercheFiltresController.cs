using ImmoSphere.Api.Dtos.Biens;
using ImmoSphere.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImmoSphere.Api.Controllers;

[ApiController]
[Route("api/biens/filtres")]
public class RechercheFiltresController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;

    public RechercheFiltresController(
        ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Récupère les options disponibles pour les filtres
    /// de recherche immobilière.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<RechercheFiltresResponseDto>> GetAsync(
        CancellationToken cancellationToken)
    {
        var typesBiens = await _dbContext.TypesBien
            .AsNoTracking()
            .OrderBy(type => type.Libelle)
            .Select(type => new RechercheFiltreOptionDto(
                type.Id,
                type.Libelle
            ))
            .ToListAsync(cancellationToken);

        var typesTransactions = await _dbContext.TypesTransaction
            .AsNoTracking()
            .OrderBy(type => type.Libelle)
            .Select(type => new RechercheFiltreOptionDto(
                type.Id,
                type.Libelle
            ))
            .ToListAsync(cancellationToken);

        var pebs = await _dbContext.PebBiens
            .AsNoTracking()
            .OrderBy(peb => peb.Id)
            .Select(peb => new RechercheFiltreOptionDto(
                peb.Id,
                peb.Libelle
            ))
            .ToListAsync(cancellationToken);

        var etats = await _dbContext.Etats
            .AsNoTracking()
            .OrderBy(etat => etat.Libelle)
            .Select(etat => new RechercheFiltreOptionDto(
                etat.Id,
                etat.Libelle
            ))
            .ToListAsync(cancellationToken);

        var provinces = await _dbContext.Provinces
            .AsNoTracking()
            .OrderBy(province => province.Libelle)
            .Select(province => new RechercheFiltreOptionDto(
                province.Id,
                province.Libelle
            ))
            .ToListAsync(cancellationToken);

        var response = new RechercheFiltresResponseDto(
            TypesBiens: typesBiens,
            TypesTransactions: typesTransactions,
            Pebs: pebs,
            Etats: etats,
            Provinces: provinces
        );

        return Ok(response);
    }
}