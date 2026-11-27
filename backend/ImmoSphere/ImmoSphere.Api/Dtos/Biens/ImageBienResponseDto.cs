namespace ImmoSphere.Api.Dtos.Biens;

/// <summary>Décrit une image publique affichée dans la galerie d'un bien.</summary>
public sealed class ImageBienResponseDto
{
    public string Url { get; init; } = string.Empty;

    public int Ordre { get; init; }

    public string TexteAlternatif { get; init; } = string.Empty;
}
