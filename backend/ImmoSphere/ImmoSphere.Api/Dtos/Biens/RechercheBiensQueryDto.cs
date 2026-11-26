using System.ComponentModel.DataAnnotations;

namespace ImmoSphere.Api.Dtos.Biens;

/// <summary>
/// Critères de recherche transmis par le frontend.
///
/// Toutes les propriétés de filtrage sont facultatives.
/// En l'absence de filtre, la recherche retournera
/// les biens publics et publiés, avec pagination.
/// </summary>
public class RechercheBiensQueryDto
{
    // ========================================
    // RECHERCHE TEXTUELLE
    // ========================================
    
    [MaxLength(120)]
    public string? Recherche { get; init; }

    [MaxLength(100)]
    public string? Localite { get; init; }

    [RegularExpression(
        @"^\d{4}$",
        ErrorMessage = "Le code postal doit contenir 4 chiffres."
    )]
    public string? CodePostal { get; init; }
    
    // ========================================
    // LOCALISATION ET TYPES
    // ========================================

    [Range(1, int.MaxValue)]
    public int? ProvinceId { get; init; }

    [Range(1, int.MaxValue)]
    public int? TypeTransactionId { get; init; }

    [Range(1, int.MaxValue)]
    public int? TypeBienId { get; init; }

    [Range(1, int.MaxValue)]
    public int? PebBienId { get; init; }

    [Range(1, int.MaxValue)]
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
    // PIÈCES
    // ========================================

    [Range(0, int.MaxValue)]
    public int? NbChambresMin { get; init; }

    [Range(0, int.MaxValue)]
    public int? NbSdbMin { get; init; }


    // ========================================
    // ÉQUIPEMENTS
    // ========================================

    public bool? Garage { get; init; }

    public bool? Parking { get; init; }

    public bool? Jardin { get; init; }

    public bool? Terrasse { get; init; }

    public bool? Balcon { get; init; }

    public bool? Ascenseur { get; init; }

    public bool? Piscine { get; init; }


    // ========================================
    // TRI
    // ========================================

    /// <summary>
    /// Valeurs acceptées :
    /// id-desc, prix-asc, prix-desc, surface-desc.
    /// </summary>
    [RegularExpression(
        "^(id-desc|prix-asc|prix-desc|surface-desc)$",
        ErrorMessage = "Le critère de tri est invalide."
    )]
    public string Tri { get; init; } = "id-desc";


    // ========================================
    // PAGINATION
    // ========================================

    [Range(1, int.MaxValue)]
    public int Page { get; init; } = 1;

    [Range(1, 50)]
    public int TaillePage { get; init; } = 12;
    
    
    // ========================================
    // VALIDATION
    // ========================================

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {

        if (PrixMin is < 0 || PrixMax is < 0)
        {
            yield return new ValidationResult(
                "Les prix ne peuvent pas être négatifs.",
                new[] { nameof(PrixMin), nameof(PrixMax) }
            );
        }

        if (PrixMin.HasValue &&
            PrixMax.HasValue &&
            PrixMin.Value > PrixMax.Value)
        {
            yield return new ValidationResult(
                "Le prix minimum ne peut pas dépasser le prix maximum.",
                new[] { nameof(PrixMin), nameof(PrixMax) }
            );
        }

        if (SurfaceMin is < 0 || SurfaceMax is < 0)
        {
            yield return new ValidationResult(
                "Les superficies ne peuvent pas être négatives.",
                new[] { nameof(SurfaceMin), nameof(SurfaceMax) }
            );
        }
        
        if (SurfaceMin.HasValue &&
            SurfaceMax.HasValue &&
            SurfaceMin.Value > SurfaceMax.Value)
        {
            yield return new ValidationResult(
                "La superficie minimum ne peut pas dépasser la superficie maximum.",
                new[] { nameof(SurfaceMin), nameof(SurfaceMax) }
            );
        }
    }
}