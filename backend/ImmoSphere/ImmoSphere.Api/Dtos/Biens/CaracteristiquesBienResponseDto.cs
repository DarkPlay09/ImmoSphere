namespace ImmoSphere.Api.Dtos.Biens;

/// <summary>Regroupe les caractéristiques principales affichées dans le détail public d'un bien.</summary>
public sealed class CaracteristiquesBienResponseDto
{
    public int AnneeConstruction { get; init; }

    public double SurfaceHabitable { get; init; }

    public double SurfaceTerrain { get; init; }

    public int NombreChambres { get; init; }

    public int NombreSallesDeBain { get; init; }

    public int NombreToilettes { get; init; }
}