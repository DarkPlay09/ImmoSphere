using System.Linq.Expressions;
using ImmoSphere.Domain.Core.Bien;
using ImmoSphere.Domain.Repository;
using ImmoSphere.Infrastructure.Mappers;
using ImmoSphere.Infrastructure.Persistence;
using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ImmoSphere.Infrastructure.Repositories;

public class BienRepository : IBienRepository
{
    private readonly ILogger<BienRepository> _logger;
    private readonly ApplicationDbContext _context;

    public BienRepository(
        ApplicationDbContext context,
        ILogger<BienRepository> logger)
    {
        _logger = logger;
        _context = context;
    }

    public async Task<Bien> GetBienByIdAsync(int id, CancellationToken cancellationToken)
    {
        var entity = await BuildBienDetailQuery()
            .FirstOrDefaultAsync(
                b => b.Id == id,
                cancellationToken);

        if (entity == null)
        {
            throw new KeyNotFoundException(
                $"Le bien avec l'ID {id} n'existe pas.");
        }

        return BienMapper.BienToDomain(entity);
    }

    public async Task<Bien> GetPublishedBienByIdAsync(int id, CancellationToken cancellationToken)
    {
        var entity = await BuildBienDetailQuery()
            .FirstOrDefaultAsync(
                b => b.Id == id
                    && b.EstVisible == true
                    && b.EstBrouillon == false,
                cancellationToken);

        if (entity == null)
        {
            throw new KeyNotFoundException(
                $"Le bien avec l'ID {id} n'existe pas.");
        }

        return BienMapper.BienToDomain(entity);
    }
    
    // ==========================================
    // RECHERCHE DES BIENS
    // ==========================================

    public async Task<ResultatRechercheBiens> SearchAsync(
        CriteresRechercheBiens criteres,
        CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(criteres);

        // On ne recherche que les annonces publiées.
        IQueryable<BienEntity> query = _context.Biens
            .AsNoTracking()
            .Where(b =>
                b.EstVisible == true &&
                b.EstBrouillon == false);

        // Application des filtres
        query = ApplyFilters(query, criteres);

        // Nombre total avant pagination
        int total = await query.CountAsync(cancellationToken);

        // Application du tri
        query = ApplySorting(query, criteres.Tri);

        // Pagination sécurisée
        int page = Math.Max(1, criteres.Page);
        int taillePage = Math.Clamp(criteres.TaillePage, 1, 50);

        long offset = ((long)page - 1) * taillePage;

        List<BienRechercheResume> biens;

        if (offset > int.MaxValue)
        {
            biens = new List<BienRechercheResume>();
        }
        else
        {
            biens = await query
                .Skip((int)offset)
                .Take(taillePage)
                .Select(b => new BienRechercheResume
                {
                    Id = b.Id,

                    Titre = b.Titre,
                    Description = b.Description,
                    Prix = b.Prix,

                    CodePostal = b.CodePostal ?? string.Empty,
                    Localite = b.Localite ?? string.Empty,

                    Province = b.Province != null
                        ? b.Province.Libelle
                        : null,

                    AdresseConfidentielle =
                        b.EstAdresseConfidentielle == true,

                    TypeBien = b.TypeBien != null
                        ? b.TypeBien.Libelle
                        : string.Empty,

                    TypeTransaction = b.TypeTransaction != null
                        ? b.TypeTransaction.Libelle
                        : string.Empty,

                    Peb = b.PebBien != null
                        ? b.PebBien.Libelle
                        : null,

                    SurfaceHabitable = b.SurfaceHab,
                    NombreChambres = b.NbChambres,
                    NombreSallesDeBain = b.NbSdb,

                    ImagePrincipale = b.Images
                        .OrderBy(i => i.Id)
                        .Select(i => i.Chemin)
                        .FirstOrDefault(),

                    NombrePhotos = b.Images.Count()
                })
                .ToListAsync(cancellationToken);
        }

        return new ResultatRechercheBiens
        {
            Biens = biens,
            Total = total,
            Page = page,
            TaillePage = taillePage
        };
    }

    // ==========================================
    // FILTRES
    // ==========================================

    private static IQueryable<BienEntity> ApplyFilters(
        IQueryable<BienEntity> query,
        CriteresRechercheBiens c)
    {
        // Recherche globale : titre, description et ville
        string recherche = RechercheTexte.Normaliser(c.Recherche);

        if (recherche.Length > 0)
        {
            query = ApplyTextFilter(
                query,
                recherche,
                nameof(BienEntity.Titre),
                nameof(BienEntity.Description),
                nameof(BienEntity.Localite)
            );
        }

        // Ville
        string localite = RechercheTexte.Normaliser(c.Localite);

        if (localite.Length > 0)
        {
            query = ApplyTextFilter(
                query,
                localite,
                nameof(BienEntity.Localite)
            );
        }

        // Code postal
        if (!string.IsNullOrWhiteSpace(c.CodePostal))
        {
            string codePostal = c.CodePostal.Trim();

            query = query.Where(b =>
                b.CodePostal == codePostal);
        }

        // Tables de référence
        if (c.ProvinceId is int provinceId)
            query = query.Where(b => b.ProvinceId == provinceId);

        if (c.TypeTransactionId is int transactionId)
            query = query.Where(b => b.TypeTransactionId == transactionId);

        if (c.TypeBienId is int typeBienId)
            query = query.Where(b => b.TypeBienId == typeBienId);

        if (c.PebBienId is int pebId)
            query = query.Where(b => b.PebBienId == pebId);

        if (c.EtatId is int etatId)
            query = query.Where(b => b.EtatId == etatId);

        // Prix
        if (c.PrixMin is decimal prixMin)
            query = query.Where(b => b.Prix >= prixMin);

        if (c.PrixMax is decimal prixMax)
            query = query.Where(b => b.Prix <= prixMax);

        // Superficie
        if (c.SurfaceMin is decimal surfaceMin)
            query = query.Where(b => b.SurfaceHab >= surfaceMin);

        if (c.SurfaceMax is decimal surfaceMax)
            query = query.Where(b => b.SurfaceHab <= surfaceMax);

        // Pièces
        if (c.NbChambresMin is int chambres)
            query = query.Where(b => b.NbChambres >= chambres);

        if (c.NbSdbMin is int sallesDeBain)
            query = query.Where(b => b.NbSdb >= sallesDeBain);

        // Équipements
        if (c.Garage is bool garage)
            query = query.Where(b => b.AGarage == garage);

        if (c.Parking is bool parking)
            query = query.Where(b => b.AParking == parking);

        if (c.Jardin is bool jardin)
            query = query.Where(b => b.AJardin == jardin);

        if (c.Terrasse is bool terrasse)
            query = query.Where(b => b.ATerrasse == terrasse);

        if (c.Balcon is bool balcon)
            query = query.Where(b => b.ABalcon == balcon);

        if (c.Ascenseur is bool ascenseur)
            query = query.Where(b => b.AAscenseur == ascenseur);

        if (c.Piscine is bool piscine)
            query = query.Where(b => b.APiscine == piscine);

        return query;
    }

    // ==========================================
    // RECHERCHE TEXTUELLE
    // ==========================================

    private static IQueryable<BienEntity> ApplyTextFilter(
        IQueryable<BienEntity> query,
        string recherche,
        params string[] champs)
    {
        var parametre = Expression.Parameter(
            typeof(BienEntity),
            "b"
        );

        Expression? condition = null;

        foreach (string champ in champs)
        {
            Expression propriete = Expression.Property(
                parametre,
                champ
            );

            Expression contient = RechercheTexte.Contient(
                propriete,
                recherche
            );

            condition = condition == null
                ? contient
                : Expression.OrElse(condition, contient);
        }

        if (condition == null)
            return query;

        var filtre = Expression.Lambda<Func<BienEntity, bool>>(
            condition,
            parametre
        );

        return query.Where(filtre);
    }

    // ==========================================
    // TRI
    // ==========================================

    private static IQueryable<BienEntity> ApplySorting(
        IQueryable<BienEntity> query,
        string tri)
    {
        return tri switch
        {
            "prix-asc" => query
                .OrderBy(b => b.Prix == null)
                .ThenBy(b => b.Prix)
                .ThenBy(b => b.Id),

            "prix-desc" => query
                .OrderBy(b => b.Prix == null)
                .ThenByDescending(b => b.Prix)
                .ThenBy(b => b.Id),

            "surface-desc" => query
                .OrderBy(b => b.SurfaceHab == null)
                .ThenByDescending(b => b.SurfaceHab)
                .ThenBy(b => b.Id),

            // Tri technique par identifiant décroissant.
            // TODO : À remplacer par une date lorsque la date de publication sera disponible.
            _ => query.OrderByDescending(b => b.Id)
        };
    }

    private IQueryable<BienEntity> BuildBienDetailQuery()
    {
        return _context.Biens
            .AsNoTracking()

            // Tables de référence
            .Include(b => b.TypeBien)
            .Include(b => b.PebBien)
            .Include(b => b.TypeTransaction)
            .Include(b => b.Etat)
            .Include(b => b.EtatVente)
            .Include(b => b.TypeConfiguration)
            .Include(b => b.Province)
            .Include(b => b.TypeChauffage)

            // Images publiques, dans l'ordre de la galerie
            .Include(b => b.Images.OrderBy(image => image.Ordre))

            // Rendez-vous et leur statut
            .Include(b => b.RendezVous)
            .ThenInclude(r => r.StatutRendezVous)

            // Disponibilités et leur statut
            .Include(b => b.Disponibilites)
            .ThenInclude(d => d.StatutDisponibilite)

            // Informations annexes et leurs libellés
            .Include(b => b.InformationsAnnexes)
            .ThenInclude(i => i.InformationAnnexe)

            // Favoris
            .Include(b => b.Favoris)
            .AsSplitQuery();
    }
}
