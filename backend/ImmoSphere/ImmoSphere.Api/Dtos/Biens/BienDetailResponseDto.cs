namespace ImmoSphere.Api.Dtos.Biens;

// Décrit le format d'une réponse HTTP pour les détails d'un bien
public sealed class BienDetailResponseDto
{
    public int Id { get; init; }

    public string Titre { get; init; } = string.Empty;

    public string Description { get; init; } = string.Empty;

    public double Prix { get; init; }

    public string TypeBien { get; init; } = string.Empty;

    public string TypeTransaction { get; init; } = string.Empty;

    public string Peb { get; init; } = string.Empty;
}