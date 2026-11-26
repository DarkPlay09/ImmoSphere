namespace ImmoSphere.Api.Dtos.Faq;

/// <summary>
/// Réponse de <c>GET /api/faq</c> (contrat <c>FaqSearchResult</c> du front). Les compteurs tiennent
/// compte de la recherche, pas de la catégorie ; <see cref="Questions"/> tient compte des deux.
/// </summary>
public class FaqSearchResultDto
{
    public int TotalCount { get; init; }
    public IReadOnlyList<FaqCategoryDto> Categories { get; init; } = Array.Empty<FaqCategoryDto>();
    public IReadOnlyList<FaqQuestionDto> Questions { get; init; } = Array.Empty<FaqQuestionDto>();
}
