namespace ImmoSphere.Domain.Core.Bien;

/// <summary>
/// Résultat métier d'une recherche paginée.
/// </summary>
public sealed class ResultatRechercheBiens
{
    public IReadOnlyList<BienRechercheResume> Biens
    { get; init; } = Array.Empty<BienRechercheResume>();

    public int Total { get; init; }

    public int Page { get; init; }

    public int TaillePage { get; init; }
}