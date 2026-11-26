namespace ImmoSphere.Domain.Core.Faq;

/// <summary>
/// Résultat d'une consultation de la FAQ. Les compteurs (<see cref="NombreTotal"/> et
/// <see cref="CategorieFaq.NombreQuestions"/>) tiennent compte de la recherche mais pas du filtre
/// par catégorie, pour que la navigation reste stable pendant le filtrage.
/// </summary>
public sealed class ResultatFaq
{
    /// <summary>Nombre de questions trouvées, questions sans catégorie comprises.</summary>
    public int NombreTotal { get; init; }

    /// <summary>Toutes les catégories, dans leur ordre d'affichage.</summary>
    public IReadOnlyList<CategorieFaq> Categories { get; init; } = Array.Empty<CategorieFaq>();

    /// <summary>Questions filtrées par la recherche et la catégorie, triées par catégorie puis par identifiant.</summary>
    public IReadOnlyList<QuestionFaq> Questions { get; init; } = Array.Empty<QuestionFaq>();
}
