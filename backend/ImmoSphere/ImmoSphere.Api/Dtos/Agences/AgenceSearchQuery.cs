namespace ImmoSphere.Api.Dtos.Agences;

/// <summary>
/// Paramètres bruts de <c>GET /api/agences</c> (noms de <c>AgenceSearchCriteria</c> côté front).
/// Tout est lu en texte pour que <see cref="AgenceSearchQueryParser"/> renvoie une erreur
/// avec un code stable, y compris quand <c>page</c> n'est pas un nombre.
/// </summary>
public class AgenceSearchQuery
{
    /// <summary>Recherche dans le nom.</summary>
    public string? Name { get; init; }

    /// <summary>Ville ou code postal (« Liège », « 4000 », « Liège, 4000 »).</summary>
    public string? Location { get; init; }

    /// <summary>all | brussels | flanders | wallonia (all par défaut).</summary>
    public string? Region { get; init; }

    /// <summary>relevance | name | rating (relevance par défaut).</summary>
    public string? Sort { get; init; }

    /// <summary>Entier ≥ 1 (1 par défaut) ; au-delà de la dernière page, la dernière est renvoyée.</summary>
    public string? Page { get; init; }

    /// <summary>Entier de 1 à 50 (6 par défaut).</summary>
    public string? PageSize { get; init; }
}
