namespace ImmoSphere.Domain.Core.Agence;

/// <summary>
/// Agence immobilière consultable par le public (UC37).
/// Les champs absents de la base (horaires, n° IPI, Federia, quartier...) ne sont pas
/// représentés ici : ils seront ajoutés quand le schéma les prévoira.
/// </summary>
public class Agence
{
    public int Id { get; set; }
    public string Nom { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Logo { get; set; }

    public string Localite { get; set; } = string.Empty;
    public string? Rue { get; set; }
    public string? Numero { get; set; }
    public string CodePostal { get; set; } = string.Empty;

    /// <summary>Déduite du code postal ; null si le code postal n'est pas un code belge valide.</summary>
    public Region? Region { get; set; }

    public string? Telephone { get; set; }
    public string? Mail { get; set; }
    public string? SiteWeb { get; set; }
    public string? Bce { get; set; }

    /// <summary>Titres des spécifications qui ne sont pas une catégorie de <see cref="AgenceSpecifications"/>.</summary>
    public IList<string> Tags { get; set; } = new List<string>();

    public AgenceSpecifications Specifications { get; set; } = new();

    /// <summary>Moyenne des avis reçus par les membres de l'agence ; null s'il n'y en a aucun.</summary>
    public double? Note { get; set; }
    public int NombreAvis { get; set; }

    /// <summary>Nombre de biens visibles (hors brouillons) publiés par les membres de l'agence.</summary>
    public int NombreBiens { get; set; }
}
