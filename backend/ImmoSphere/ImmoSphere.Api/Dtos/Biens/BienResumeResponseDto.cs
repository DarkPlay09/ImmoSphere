namespace ImmoSphere.Api.Dtos.Biens;

/// <summary>
/// Données publiques nécessaires à une carte de bien
/// sur la page d'accueil.
/// </summary>
public sealed class BienResumeResponseDto
{
    public int Id { get; init; }

    public string Titre { get; init; } = string.Empty;

    public decimal Prix { get; init; }

    public string Localite { get; init; } = string.Empty;

    public string CodePostal { get; init; } = string.Empty;

    public string TypeBien { get; init; } = string.Empty;

    public string TypeTransaction { get; init; } = string.Empty;

    public string? Peb { get; init; }

    public int NombreChambres { get; init; }

    public int NombreSallesDeBain { get; init; }

    public decimal SurfaceHabitable { get; init; }

    public bool Visite360 { get; init; }
}