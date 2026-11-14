namespace ImmoSphere.Api.Dtos.Biens;

/// <summary>Regroupe les équipements affichés dans le détail public d'un bien.</summary>
public sealed class EquipementsBienResponseDto
{
    public bool Garage { get; init; }

    public bool Parking { get; init; }

    public bool Jardin { get; init; }

    public bool Balcon { get; init; }

    public bool Cave { get; init; }

    public bool Terrasse { get; init; }

    public bool Grenier { get; init; }

    public bool Ascenseur { get; init; }

    public bool Piscine { get; init; }

    public bool Cheminee { get; init; }
}