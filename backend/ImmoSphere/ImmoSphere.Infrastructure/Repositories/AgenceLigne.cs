namespace ImmoSphere.Infrastructure.Repositories;

/// <summary>
/// Projection SQL d'une agence : colonnes de <c>agence</c>, ses spécifications et les
/// valeurs calculées à partir d'autres tables (avis, biens). Évite de charger les entités complètes.
/// </summary>
internal sealed class AgenceLigne
{
    public int Id { get; init; }
    public string Nom { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? Logo { get; init; }
    public string? Localite { get; init; }
    public string? Rue { get; init; }
    public string? Numero { get; init; }
    public string? CodePostal { get; init; }
    public string? NumeroTel { get; init; }
    public string? Mail { get; init; }
    public string? LienPlateforme { get; init; }
    public string? Bce { get; init; }

    public List<SpecificationLigne> Specifications { get; init; } = new();

    /// <summary>Moyenne des étoiles des avis reçus par les membres ; null sans avis noté.</summary>
    public double? Note { get; init; }
    public int NombreAvis { get; init; }
    public int NombreBiens { get; init; }
}

internal sealed class SpecificationLigne
{
    public string Titre { get; init; } = string.Empty;
    public string? Description { get; init; }
}
