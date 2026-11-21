namespace ImmoSphere.Domain.Core.Bien;

/// <summary>
/// Informations d'un bien nécessaires à l'affichage
/// dans les résultats de recherche.
/// </summary>
public sealed class BienRechercheResume
{
    // ========================================
    // IDENTIFICATION
    // ========================================
    
    public int Id { get; init; }

    public string Titre { get; init; } = string.Empty;

    public string? Description { get; init; }

    public decimal? Prix { get; init; }

    
    // ========================================
    // LOCALISATION PUBLIQUE
    // ========================================

    public string CodePostal { get; init; } = string.Empty;

    public string Localite { get; init; } = string.Empty;

    public string? Province { get; init; }

    public bool AdresseConfidentielle { get; init; }

    
    // ========================================
    // CLASSIFICATION
    // ========================================

    public string TypeBien { get; init; } = string.Empty;

    public string TypeTransaction { get; init; } = string.Empty;

    public string? Peb { get; init; }

    
    // ========================================
    // CARACTERISTIQUES
    // ========================================

    public decimal? SurfaceHabitable { get; init; }

    public int? NombreChambres { get; init; }

    public int? NombreSallesDeBain { get; init; }


    // ========================================
    // PHOTOS
    // ========================================

    public string? ImagePrincipale { get; init; }

    public int NombrePhotos { get; init; }
}