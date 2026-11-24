namespace ImmoSphere.Api.Dtos.Biens;

/// <summary>
/// Représente un bien immobilier dans les résultats
/// d'une recherche.
///
/// Contient uniquement les informations nécessaires
/// à l'affichage d'une carte de résultat.
/// </summary>
public class BienRechercheItemResponseDto
{
    // ========================================
    // IDENTIFICATION
    // ========================================
    
    public int Id { get; init; }
    
    public string Titre { get; init; } = string.Empty;
    
    public string? Description { get; init; }
    
    
    // ========================================
    // PRIX
    // ========================================
    
    public decimal? Prix { get; init; }
    
    
    // ========================================
    // LOCALISATION PUBLIQUE
    // ========================================
    
    public string CodePostal { get; init; } = string.Empty;

    public string Localite { get; init; } = string.Empty;

    public string? Province { get; init; }

    public bool AdresseConfidentielle { get; init; }
    
    
    // ========================================
    // TYPE DE BIEN
    // ========================================
    
    public string TypeBien { get; init; } = string.Empty;
    
    public string TypeTransaction { get; init; } = string.Empty;
    
    
    // ========================================
    // PERFORMANCE ENERGETIQUE
    // ========================================
    
    public string? Peb { get; init; }
    
    
    // ========================================
    // CARACTERISTIQUES
    // ========================================
    
    public decimal? SurfaceHabitable { get; init; }
    
    public int? NombreChambres { get; init; }
    
    public int? NombreSallesDeBains { get; init; }
    
    
    // ========================================
    // PHOTOS
    // ========================================
    
    public string? ImagePrincipale { get; init; }
    
    public int NombrePhotos { get; init; }
}