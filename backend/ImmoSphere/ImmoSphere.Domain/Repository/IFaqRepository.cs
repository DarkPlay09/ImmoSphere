using ImmoSphere.Domain.Core.Faq;

namespace ImmoSphere.Domain.Repository;

public interface IFaqRepository
{
    /// <summary>
    /// Questions ayant une réponse, triées par identifiant. Si <paramref name="recherche"/> est
    /// renseignée, seules les questions dont la question ou la réponse la contient sont renvoyées
    /// (insensible à la casse et aux accents).
    /// </summary>
    Task<IList<QuestionFaq>> SearchAsync(string? recherche, CancellationToken cancellationToken = default);
}
