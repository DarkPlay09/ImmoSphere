namespace ImmoSphere.Api.Dtos.Biens;

/// <summary>Regroupe les caractéristiques principales affichées dans le détail public d'un bien.</summary>
public sealed class CaracteristiquesBienResponseDto
{
    public int AnneeConstruction { get; init; }

    public double SurfaceHabitable { get; init; }

    public double SurfaceTerrain { get; init; }

    public double SurfaceJardin { get; init; }

    public double SurfaceTerrasse { get; init; }

    public int Etage { get; init; }

    public int NombreEtages { get; init; }

    public int NombreChambres { get; init; }

    public int NombreSallesDeBain { get; init; }

    public int NombreToilettes { get; init; }

    public double ConsommationEnergie { get; init; }

    public string NumeroPeb { get; init; } = string.Empty;

    public string Etat { get; init; } = string.Empty;

    public string EtatVente { get; init; } = string.Empty;

    public string TypeConfiguration { get; init; } = string.Empty;

    public string TypeChauffage { get; init; } = string.Empty;
}