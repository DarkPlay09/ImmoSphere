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

    public async Task<IList<QuestionFaq>> SearchAsync(string? recherche, CancellationToken cancellationToken = default)
    {
        // Filtre et tri faits en SQL. Une question sans réponse n'est pas affichée.
        var requete = _context.Faqs
            .AsNoTracking()
            .Where(f => f.Libelle != null && f.Libelle.Trim() != string.Empty);

        string terme = RechercheTexte.Normaliser(recherche);
        if (terme.Length > 0)
        {
            requete = requete.Where(QuestionOuReponseContient(terme));
        }

        // La table n'a pas d'ordre d'affichage : l'ordre de création fait foi.
        var entites = await requete.OrderBy(f => f.Id).ToListAsync(cancellationToken);

        return entites.Select(FaqMapper.FaqToDomain).ToList();
    }

    private static Expression<Func<FaqEntity, bool>> QuestionOuReponseContient(string terme)
    {
        var faq = Expression.Parameter(typeof(FaqEntity), "f");

        var corps = Expression.OrElse(
            RechercheTexte.Contient(Expression.Property(faq, nameof(FaqEntity.Titre)), terme),
            RechercheTexte.Contient(Expression.Property(faq, nameof(FaqEntity.Libelle)), terme));

        return Expression.Lambda<Func<FaqEntity, bool>>(corps, faq);
    }
}
