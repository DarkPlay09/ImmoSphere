using ImmoSphere.Domain.Core.Faq;
using ImmoSphere.Domain.Exceptions;

namespace ImmoSphere.Domain.Services.Interfaces;

public interface IFaqService
{
    /// <summary>
    /// FAQ publique, filtrée par <paramref name="recherche"/> et <paramref name="codeCategorie"/>
    /// s'ils sont renseignés.
    /// </summary>
    /// <exception cref="RechercheTropLongueException">La recherche dépasse <see cref="QuestionFaq.LongueurMaxRecherche"/>.</exception>
    /// <exception cref="CategorieFaqInconnueException">Aucune catégorie n'a ce code.</exception>
    Task<ResultatFaq> SearchAsync(
        string? recherche,
        string? codeCategorie,
        CancellationToken cancellationToken = default);
}
