using ImmoSphere.Domain.Core.Agence;

namespace ImmoSphere.Domain.Services.Interfaces;

public interface IAgenceService
{
    Task<AgencePage> RechercherAsync(AgenceRecherche recherche, CancellationToken cancellationToken = default);

    /// <exception cref="Exceptions.AgenceNotFoundException">Si l'agence n'existe pas.</exception>
    Task<Agence> ObtenirParIdAsync(int id, CancellationToken cancellationToken = default);
}
