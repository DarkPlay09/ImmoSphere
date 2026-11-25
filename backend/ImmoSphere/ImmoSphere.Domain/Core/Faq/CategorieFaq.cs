namespace ImmoSphere.Domain.Core.Faq;

/// <summary>
/// Catégorie de la FAQ et nombre de questions qu'elle contient pour la recherche en cours.
/// Le libellé n'est pas stocké : le front traduit <see cref="Code"/>.
/// </summary>
public sealed class CategorieFaq
{
    public string Code { get; init; } = string.Empty;
    public int NombreQuestions { get; init; }
}
