namespace ImmoSphere.Api.Dtos.Biens;

/// <summary>
/// Réponse paginée de la recherche immobilière.
///
/// Contient les biens correspondant aux filtres
/// ainsi que les informations de pagination.
/// </summary>
public sealed class RechercheBiensResponseDto
{
    // Résultats de la page courante

    public IReadOnlyList<BienRechercheItemResponseDto> Biens
    { get; init; } = Array.Empty<BienRechercheItemResponseDto>();


    // Nombre total de biens correspondant à la recherche

    public int Total { get; init; }


    // Numéro de la page actuelle

    public int Page { get; init; } = 1;


    // Nombre maximal de biens par page

    public int TaillePage { get; init; } = 12;


    // Nombre total de pages

    public int NombrePages =>
        TaillePage > 0
            ? (int)Math.Ceiling((double)Total / TaillePage)
            : 0;
}