
using ImmoSphere.Api.Dtos.Biens;
using ImmoSphere.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImmoSphere.Api.Controllers;

[ApiController]
[Route("api/accueil/biens")]
public sealed class BiensListeController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public BiensListeController(ApplicationDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Récupère les dernières annonces publiques.
    /// Ne modifie aucune donnée.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<BienResumeResponseDto>>> GetAsync(
        CancellationToken cancellationToken)
    {
        var biens = await _db.Biens
            .AsNoTracking()

            // Ne jamais exposer les brouillons
            // ni les annonces masquées.
            .Where(b =>
                b.EstVisible == true &&
                b.EstBrouillon == false &&
                b.Prix != null)

            // Le modèle actuel ne possède pas encore
            // de date de publication.
            // L'ID est un ordre provisoire.
            .OrderByDescending(b => b.Id)
            .Take(12)

            .Select(b => new BienResumeResponseDto
            {
                Id = b.Id,
                Titre = b.Titre,
                Prix = b.Prix ?? 0m,

                Localite = b.Localite ?? string.Empty,
                CodePostal = b.CodePostal ?? string.Empty,

                TypeBien = b.TypeBien != null
                    ? b.TypeBien.Libelle
                    : string.Empty,

                TypeTransaction = b.TypeTransaction != null
                    ? b.TypeTransaction.Libelle
                    : string.Empty,

                Peb = b.PebBien != null
                    ? b.PebBien.Libelle
                    : null,

                NombreChambres = b.NbChambres ?? 0,
                NombreSallesDeBain = b.NbSdb ?? 0,
                SurfaceHabitable = b.SurfaceHab ?? 0m,

                Visite360 =
                    b.Vue360 != null && b.Vue360 != ""
            })
            .ToListAsync(cancellationToken);

        return Ok(biens);
    }
}
