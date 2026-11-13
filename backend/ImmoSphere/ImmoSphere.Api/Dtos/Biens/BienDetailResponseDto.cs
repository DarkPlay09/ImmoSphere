namespace ImmoSphere.Api.Dtos.Biens;

// Décrit le format d'une réponse HTTP pour les détails d'un bien
public sealed class BienDetailResponseDto
{
    // TODO : ajouter autre part la rue, le numero, etc. car ils dépendent de la confidentialité
    public int Id { get; init; }

    public string Titre { get; init; } = string.Empty;

    public string Description { get; init; } = string.Empty;

    public double Prix { get; init; }

    public int CodePostal { get; init; }

    public string Localite { get; init; } = string.Empty;

    public string Province { get; init; } = string.Empty;

    public string TypeBien { get; init; } = string.Empty;

    public string TypeTransaction { get; init; } = string.Empty;

    public string Peb { get; init; } = string.Empty;
}