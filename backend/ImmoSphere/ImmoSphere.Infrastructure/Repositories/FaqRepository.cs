using System.Linq.Expressions;
using ImmoSphere.Domain.Core.Faq;
using ImmoSphere.Domain.Repository;
using ImmoSphere.Infrastructure.Mappers;
using ImmoSphere.Infrastructure.Persistence;
using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace ImmoSphere.Infrastructure.Repositories;

public class FaqRepository : IFaqRepository
{
    private readonly ApplicationDbContext _context;

    public FaqRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ResultatFaq> SearchAsync(
        string? recherche,
        string? codeCategorie,
        CancellationToken cancellationToken = default)
    {
        // Filtres, compteurs et tri sont faits en SQL.
        var questionsTrouvees = QuestionsTrouvees(recherche);

        // Un seul GROUP BY donne le compteur de chaque catégorie et celui des questions sans catégorie (clé null).
        var compteurs = await questionsTrouvees
            .GroupBy(f => f.CategorieFaqId)
            .Select(g => new Compteur(g.Key, g.Count()))
            .ToListAsync(cancellationToken);

        var categories = await _context.CategoriesFaq
            .AsNoTracking()
            .OrderBy(c => c.Ordre)
            .ToListAsync(cancellationToken);

        var questions = await FiltrerParCategorie(questionsTrouvees, codeCategorie)
            .Include(f => f.CategorieFaq)
            // Les questions sans catégorie viennent en dernier ; à défaut d'ordre propre, l'ordre de création fait foi.
            .OrderBy(f => f.CategorieFaq == null ? int.MaxValue : f.CategorieFaq.Ordre)
            .ThenBy(f => f.Id)
            .ToListAsync(cancellationToken);

        return Assembler(compteurs, categories, questions);
    }

    private static ResultatFaq Assembler(
        IReadOnlyList<Compteur> compteurs,
        IEnumerable<CategorieFaqEntity> categories,
        IEnumerable<FaqEntity> questions)
    {
        var nombreParCategorie = compteurs
            .Where(c => c.CategorieId.HasValue)
            .ToDictionary(c => c.CategorieId!.Value, c => c.Nombre);

        return new ResultatFaq
        {
            NombreTotal = compteurs.Sum(c => c.Nombre),
            Categories = categories
                .Select(c => FaqMapper.CategorieToDomain(c, nombreParCategorie.GetValueOrDefault(c.Id)))
                .ToList(),
            Questions = questions.Select(FaqMapper.FaqToDomain).ToList(),
        };
    }

    /// <summary>Questions publiques (avec une réponse) correspondant à la recherche.</summary>
    private IQueryable<FaqEntity> QuestionsTrouvees(string? recherche)
    {
        var requete = _context.Faqs
            .AsNoTracking()
            .Where(f => f.Libelle != null && f.Libelle.Trim() != string.Empty);

        string terme = RechercheTexte.Normaliser(recherche);
        return terme.Length > 0 ? requete.Where(QuestionOuReponseContient(terme)) : requete;
    }

    private static IQueryable<FaqEntity> FiltrerParCategorie(IQueryable<FaqEntity> requete, string? codeCategorie) =>
        codeCategorie is null
            ? requete
            : requete.Where(f => f.CategorieFaq != null && f.CategorieFaq.Code == codeCategorie);

    private static Expression<Func<FaqEntity, bool>> QuestionOuReponseContient(string terme)
    {
        var faq = Expression.Parameter(typeof(FaqEntity), "f");

        var corps = Expression.OrElse(
            RechercheTexte.Contient(Expression.Property(faq, nameof(FaqEntity.Titre)), terme),
            RechercheTexte.Contient(Expression.Property(faq, nameof(FaqEntity.Libelle)), terme));

        return Expression.Lambda<Func<FaqEntity, bool>>(corps, faq);
    }

    /// <summary>Nombre de questions trouvées pour une catégorie (null : sans catégorie).</summary>
    private sealed record Compteur(int? CategorieId, int Nombre);
}
