using ImmoSphere.Domain.Core.Faq;

namespace ImmoSphere.Domain.Repository;

public interface IFaqRepository
{
    /// <summary>
    /// Questions ayant une réponse et compteurs par catégorie. Si <paramref name="recherche"/> est
    /// renseignée, seules les questions dont la question ou la réponse la contient sont prises en
    /// compte (insensible à la casse et aux accents). <paramref name="codeCategorie"/> filtre les
    /// questions renvoyées, mais pas les compteurs.
    /// </summary>
    Task<ResultatFaq> SearchAsync(
        string? recherche,
        string? codeCategorie,
        CancellationToken cancellationToken = default);
}
