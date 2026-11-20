namespace ImmoSphere.Domain.Core.Faq;

/// <summary>
/// Question de la FAQ publique (UC7). La table <c>faq</c> ne stocke ni catégorie, ni ordre
/// d'affichage, ni traduction : une question n'a qu'un texte et une réponse.
/// </summary>
public class QuestionFaq
{
    /// <summary>Longueur maximale du texte recherché dans la FAQ.</summary>
    public const int LongueurMaxRecherche = 100;

    public int Id { get; set; }
    public string Question { get; set; } = string.Empty;
    public string Reponse { get; set; } = string.Empty;
}
