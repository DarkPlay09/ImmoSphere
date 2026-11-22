namespace ImmoSphere.Api.Dtos.Biens;

// Décrit le format d'une réponse HTTP pour les détails d'un bien
public sealed class BienDetailResponseDto
{
    public int Id { get; init; }

    public string Titre { get; init; } = string.Empty;

    public string Description { get; init; } = string.Empty;

    public double Prix { get; init; }

    public int CodePostal { get; init; }

    public string Localite { get; init; } = string.Empty;

    public string Province { get; init; } = string.Empty;

    public bool AdresseConfidentielle { get; init; }

    public string? Rue { get; init; }

    public int? Numero { get; init; }

    public string? Boite { get; init; }

    public string TypeBien { get; init; } = string.Empty;

    public string TypeTransaction { get; init; } = string.Empty;

    public string Peb { get; init; } = string.Empty;

    public IReadOnlyList<ImageBienResponseDto> Images { get; init; }
        = Array.Empty<ImageBienResponseDto>();

    public CaracteristiquesBienResponseDto Caracteristiques { get; init; } = new();

    public EquipementsBienResponseDto Equipements { get; init; } = new();

    public int NombreFavoris { get; init; }

    public IReadOnlyList<string> InformationsAnnexes { get; init; }
        = Array.Empty<string>();
}
