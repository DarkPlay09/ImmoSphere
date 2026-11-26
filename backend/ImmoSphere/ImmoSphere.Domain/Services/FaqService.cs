using ImmoSphere.Domain.Core.Faq;
using ImmoSphere.Domain.Exceptions;
using ImmoSphere.Domain.Repository;
using ImmoSphere.Domain.Services.Interfaces;

namespace ImmoSphere.Domain.Services;

public class FaqService : IFaqService
{
    private readonly IFaqRepository _repository;

    public FaqService(IFaqRepository repository)
    {
        _repository = repository;
    }

    public async Task<ResultatFaq> SearchAsync(
        string? recherche,
        string? codeCategorie,
        CancellationToken cancellationToken = default)
    {
        // Une recherche ou une catégorie vide (ou faite d'espaces) affiche toute la FAQ.
        string? terme = SansEspaces(recherche);
        if (terme?.Length > QuestionFaq.LongueurMaxRecherche)
        {
            throw new RechercheTropLongueException(QuestionFaq.LongueurMaxRecherche);
        }

        string? categorie = SansEspaces(codeCategorie);
        var resultat = await _repository.SearchAsync(terme, categorie, cancellationToken);

        // Le résultat contient toujours toutes les catégories : inutile d'interroger la base une
        // seconde fois pour vérifier que le code existe.
        if (categorie is not null && resultat.Categories.All(c => c.Code != categorie))
        {
            throw new CategorieFaqInconnueException(categorie);
        }

        return resultat;
    }

    private static string? SansEspaces(string? valeur) =>
        string.IsNullOrWhiteSpace(valeur) ? null : valeur.Trim();
}
