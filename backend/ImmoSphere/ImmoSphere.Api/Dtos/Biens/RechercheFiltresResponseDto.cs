namespace ImmoSphere.Api.Dtos.Biens;

/// <summary>
/// Option disponible dans un filtre de recherche.
/// L'identifiant correspond à celui enregistré en base.
/// </summary>
public sealed record RechercheFiltreOptionDto(
    int Id,
    string Libelle
);

/// <summary>
/// Ensemble des options proposées dans les filtres
/// de recherche immobilière.
/// </summary>
public sealed record RechercheFiltresResponseDto(
    IReadOnlyList<RechercheFiltreOptionDto> TypesBiens,
    IReadOnlyList<RechercheFiltreOptionDto> TypesTransactions,
    IReadOnlyList<RechercheFiltreOptionDto> Pebs,
    IReadOnlyList<RechercheFiltreOptionDto> Etats,
    IReadOnlyList<RechercheFiltreOptionDto> Provinces
);