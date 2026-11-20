using ImmoSphere.Domain.Core.Faq;

namespace ImmoSphere.Domain.Services.Interfaces;

public interface IFaqService
{
    /// <summary>Questions publiques de la FAQ, filtrées par <paramref name="recherche"/> si elle est renseignée.</summary>
    Task<IList<QuestionFaq>> SearchAsync(string? recherche, CancellationToken cancellationToken = default);
}
