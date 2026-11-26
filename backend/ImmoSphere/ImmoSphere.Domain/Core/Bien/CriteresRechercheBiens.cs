namespace ImmoSphere.Domain.Core.Bien;

/// <summary>
/// Critères métier utilisés pour rechercher des biens.
/// Indépendants des DTO HTTP et d'Entity Framework.
/// </summary>
public sealed class CriteresRechercheBiens
{
    // ========================================
    // RECHERCHE TEXTUELLE
    // ========================================

    public string? Recherche { get; init; }

    public string? Localite { get; init; }

    public string? CodePostal { get; init; }

    
    // ========================================
    // TABLES DE REFERENCE
    // ========================================

    public int? ProvinceId { get; init; }

    public int? TypeTransactionId { get; init; }

    public int? TypeBienId { get; init; }

    public int? PebBienId { get; init; }

    public int? EtatId { get; init; }

    
    // ========================================
    // PRIX
    // ========================================

    public decimal? PrixMin { get; init; }

    public decimal? PrixMax { get; init; }

    
    // ========================================
    // SUPERFICIE
    // ========================================

    public decimal? SurfaceMin { get; init; }

    public decimal? SurfaceMax { get; init; }

    
    // ========================================
    // PIECES
    // ========================================

    public int? NbChambresMin { get; init; }

    public int? NbSdbMin { get; init; }

    
    // ========================================
    // EQUIPEMENTS
    // ========================================

    public bool? Garage { get; init; }

    public bool? Parking { get; init; }

    public bool? Jardin { get; init; }

    public bool? Terrasse { get; init; }

    public bool? Balcon { get; init; }

    public bool? Ascenseur { get; init; }

    public bool? Piscine { get; init; }

    
    // ========================================
    // TRI ET PAGINATION
    // ========================================

    public string Tri { get; init; } = "id-desc";

    public int Page { get; init; } = 1;

    public int TaillePage { get; init; } = 12;
}