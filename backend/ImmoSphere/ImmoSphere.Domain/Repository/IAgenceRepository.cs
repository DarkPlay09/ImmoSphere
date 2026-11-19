using ImmoSphere.Domain.Core.Agence;

namespace ImmoSphere.Domain.Repository;

public interface IAgenceRepository
{
    /// <summary>Nombre d'agences correspondant aux filtres (nom, localisation, région).</summary>
    Task<int> CompterAsync(AgenceRecherche recherche, CancellationToken cancellationToken = default);

    /// <summary>Agences filtrées et triées, en sautant les <paramref name="decalage"/> premières.</summary>
    Task<IList<Agence>> RechercherAsync(
        AgenceRecherche recherche,
        int decalage,
        int nombre,
        CancellationToken cancellationToken = default);

    /// <summary>Null si l'agence n'existe pas.</summary>
    Task<Agence?> TrouverParIdAsync(int id, CancellationToken cancellationToken = default);
}
