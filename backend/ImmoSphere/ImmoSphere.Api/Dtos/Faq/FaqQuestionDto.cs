namespace ImmoSphere.Api.Dtos.Faq;

/// <summary>
/// Contrat de <c>frontend/src/app/shared/faq/models/faq.model.ts</c> (<c>FaqQuestion</c>).
/// L'auteur de la question (<c>id_utilisateur</c>) n'est jamais exposé.
/// </summary>
public class FaqQuestionDto
{
    public int Id { get; init; }
    public string Question { get; init; } = string.Empty;
    public string Answer { get; init; } = string.Empty;
}
