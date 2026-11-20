using ImmoSphere.Domain.Core.Agence;

namespace ImmoSphere.Domain.Repository;

public interface IAgenceRepository
{
    /// <summary>Nombre d'agences correspondant aux filtres (nom, localisation, région).</summary>
    Task<int> CountAsync(AgenceRecherche recherche, CancellationToken cancellationToken = default);

    /// <summary>Agences filtrées et triées, en sautant les <paramref name="offset"/> premières.</summary>
    Task<IList<Agence>> SearchAsync(
        AgenceRecherche recherche,
        int offset,
        int count,
        CancellationToken cancellationToken = default);

    /// <summary>Null si l'agence n'existe pas.</summary>
    Task<Agence?> FindByIdAsync(int id, CancellationToken cancellationToken = default);
}
