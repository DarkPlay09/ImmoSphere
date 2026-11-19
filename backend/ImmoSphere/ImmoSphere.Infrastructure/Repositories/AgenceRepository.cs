using System.Linq.Expressions;
using System.Reflection;
using ImmoSphere.Domain.Core.Agence;
using ImmoSphere.Domain.Repository;
using ImmoSphere.Infrastructure.Mappers;
using ImmoSphere.Infrastructure.Persistence;
using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace ImmoSphere.Infrastructure.Repositories;

public class AgenceRepository : IAgenceRepository
{
    private static readonly char[] SeparateursLocalisation = [' ', ','];

    private static readonly MethodInfo StringCompare =
        typeof(string).GetMethod(nameof(string.Compare), [typeof(string), typeof(string)])!;

    private readonly ApplicationDbContext _context;

    public AgenceRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public Task<int> CompterAsync(AgenceRecherche recherche, CancellationToken cancellationToken = default)
    {
        return Filtrer(_context.Agences.AsNoTracking(), recherche).CountAsync(cancellationToken);
    }

    public async Task<IList<Agence>> RechercherAsync(
        AgenceRecherche recherche,
        int decalage,
        int nombre,
        CancellationToken cancellationToken = default)
    {
        // Une seule requête SQL : filtre, tri, pagination et spécifications.
        var lignes = await Trier(Projeter(Filtrer(_context.Agences.AsNoTracking(), recherche)), recherche.Tri)
            .Skip(decalage)
            .Take(nombre)
            .ToListAsync(cancellationToken);

        return lignes.Select(AgenceMapper.AgenceToDomain).ToList();
    }

    public async Task<Agence?> TrouverParIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var ligne = await Projeter(_context.Agences.AsNoTracking().Where(a => a.Id == id))
            .FirstOrDefaultAsync(cancellationToken);

        return ligne is null ? null : AgenceMapper.AgenceToDomain(ligne);
    }

    // ==========================================
    // FILTRES
    // ==========================================

    private static IQueryable<AgenceEntity> Filtrer(IQueryable<AgenceEntity> requete, AgenceRecherche recherche)
    {
        var agence = Expression.Parameter(typeof(AgenceEntity), "a");
        Expression Champ(string nom) => Expression.Property(agence, nom);
        Expression<Func<AgenceEntity, bool>> Lambda(Expression corps) =>
            Expression.Lambda<Func<AgenceEntity, bool>>(corps, agence);

        string nom = RechercheTexte.Normaliser(recherche.Nom);
        if (nom.Length > 0)
        {
            requete = requete.Where(Lambda(RechercheTexte.Contient(Champ(nameof(AgenceEntity.Nom)), nom)));
        }

        // Chaque mot de la localisation doit se retrouver dans la ville ou le code postal.
        // Le quartier (« district » côté front) n'existe pas en base.
        var mots = RechercheTexte.Normaliser(recherche.Localisation)
            .Split(SeparateursLocalisation, StringSplitOptions.RemoveEmptyEntries);
        foreach (string mot in mots)
        {
            requete = requete.Where(Lambda(Expression.OrElse(
                RechercheTexte.Contient(Champ(nameof(AgenceEntity.Localite)), mot),
                RechercheTexte.Contient(Champ(nameof(AgenceEntity.CodePostal)), mot))));
        }

        if (recherche.Region is { } region)
        {
            requete = requete.Where(Lambda(FiltreRegion(Champ(nameof(AgenceEntity.CodePostal)), region)));
        }

        return requete;
    }

    /// <summary>
    /// La région n'est pas stockée : filtre sur les tranches de codes postaux de la région
    /// (<c>code_postal</c> de 4 caractères compris entre le début et la fin d'une tranche).
    /// </summary>
    private static Expression FiltreRegion(Expression codePostal, Region region)
    {
        Expression longueurValide = Expression.AndAlso(
            Expression.NotEqual(codePostal, Expression.Constant(null, typeof(string))),
            Expression.Equal(
                Expression.Property(codePostal, nameof(string.Length)),
                Expression.Constant(4)));

        Expression? dansUneTranche = null;
        foreach (var tranche in RegionCodesPostaux.Tranches.Where(t => t.Region == region))
        {
            Expression dansTranche = Expression.AndAlso(
                Expression.GreaterThanOrEqual(
                    Expression.Call(StringCompare, codePostal, Expression.Constant(tranche.Debut)),
                    Expression.Constant(0)),
                Expression.LessThanOrEqual(
                    Expression.Call(StringCompare, codePostal, Expression.Constant(tranche.Fin)),
                    Expression.Constant(0)));

            dansUneTranche = dansUneTranche is null ? dansTranche : Expression.OrElse(dansUneTranche, dansTranche);
        }

        return Expression.AndAlso(longueurValide, dansUneTranche ?? Expression.Constant(false));
    }

    // ==========================================
    // TRI
    // ==========================================

    /// <summary>Tri sur la projection : le calcul de la note n'est défini qu'à un seul endroit (<see cref="Projeter"/>).</summary>
    private static IQueryable<AgenceLigne> Trier(IQueryable<AgenceLigne> requete, AgenceTri tri)
    {
        return tri switch
        {
            AgenceTri.Nom => requete.OrderBy(a => a.Nom).ThenBy(a => a.Id),

            // Agences notées d'abord (PostgreSQL place les NULL en tête d'un tri décroissant).
            AgenceTri.Note => requete
                .OrderBy(a => a.Note == null)
                .ThenByDescending(a => a.Note)
                .ThenBy(a => a.Id),

            _ => requete.OrderBy(a => a.Id),
        };
    }

    // ==========================================
    // PROJECTION
    // ==========================================

    private static IQueryable<AgenceLigne> Projeter(IQueryable<AgenceEntity> requete)
    {
        return requete.Select(a => new AgenceLigne
        {
            Id = a.Id,
            Nom = a.Nom,
            Description = a.Description,
            Logo = a.Logo,
            Localite = a.Localite,
            Rue = a.Rue,
            Numero = a.Numero,
            CodePostal = a.CodePostal,
            NumeroTel = a.NumeroTel,
            Mail = a.Mail,
            LienPlateforme = a.LienPlateforme,
            Bce = a.Bce,

            Specifications = a.Specifications
                .OrderBy(s => s.SpecificationId)
                .Select(s => new SpecificationLigne
                {
                    Titre = s.Specification.Titre,
                    Description = s.Specification.Description,
                })
                .ToList(),

            // Avis reçus par les membres de l'agence (la table avis n'a pas de lien direct avec agence).
            Note = a.Membres.SelectMany(m => m.AvisRecus).Average(av => (double?)av.NbEtoiles),
            NombreAvis = a.Membres.SelectMany(m => m.AvisRecus).Count(av => av.NbEtoiles != null),

            // Biens publiés par les membres, visibles et hors brouillon.
            NombreBiens = a.Membres
                .SelectMany(m => m.BiensPublies)
                .Count(b => b.EstVisible == true && b.EstBrouillon != true),
        });
    }
}
