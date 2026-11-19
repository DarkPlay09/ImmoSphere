using ImmoSphere.Domain.Core.Agence;
using ImmoSphere.Domain.Exceptions;
using ImmoSphere.Domain.Repository;
using ImmoSphere.Domain.Services.Interfaces;

namespace ImmoSphere.Domain.Services;

public class AgenceService : IAgenceService
{
    private readonly IAgenceRepository _repository;

    public AgenceService(IAgenceRepository repository)
    {
        _repository = repository;
    }

    public async Task<AgencePage> RechercherAsync(AgenceRecherche recherche, CancellationToken cancellationToken = default)
    {
        int taillePage = Math.Clamp(recherche.TaillePage, 1, AgenceRecherche.TailleMax);

        int total = await _repository.CompterAsync(recherche, cancellationToken);

        // Même règle que le front : la page demandée est ramenée dans [1, nombre de pages].
        int nombrePages = Math.Max(1, (int)Math.Ceiling(total / (double)taillePage));
        int page = Math.Clamp(recherche.Page, 1, nombrePages);

        IList<Agence> agences = total == 0
            ? new List<Agence>()
            : await _repository.RechercherAsync(recherche, (page - 1) * taillePage, taillePage, cancellationToken);

        return new AgencePage
        {
            Agences = agences,
            Total = total,
            Page = page,
            NombrePages = nombrePages,
        };
    }

    public async Task<Agence> ObtenirParIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _repository.TrouverParIdAsync(id, cancellationToken)
            ?? throw new AgenceNotFoundException(id);
    }
}
