using ImmoSphere.Domain.Repository;
using ImmoSphere.Domain.Services.Interfaces;

namespace ImmoSphere.Domain.Services;

public class FavoriService : IFavoriService
{
    private readonly IFavoriRepository _repository;

    public FavoriService(IFavoriRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<int>> GetBienIdsAsync(
        string identityUserId,
        CancellationToken cancellationToken = default)
    {
        var utilisateurId = await GetUtilisateurIdAsync(
            identityUserId,
            cancellationToken);

        return await _repository.GetBienIdsAsync(
            utilisateurId,
            cancellationToken);
    }

    public async Task<bool> IsFavoriteAsync(
        string identityUserId,
        int bienId,
        CancellationToken cancellationToken = default)
    {
        ValidateBienId(bienId);

        var utilisateurId = await GetUtilisateurIdAsync(
            identityUserId,
            cancellationToken);

        return await _repository.ExistsAsync(
            utilisateurId,
            bienId,
            cancellationToken);
    }

    public async Task AddAsync(
        string identityUserId,
        int bienId,
        CancellationToken cancellationToken = default)
    {
        ValidateBienId(bienId);

        var utilisateurId = await GetUtilisateurIdAsync(
            identityUserId,
            cancellationToken);

        var isPublished = await _repository.IsPublishedBienAsync(
            bienId,
            cancellationToken);

        if (!isPublished)
        {
            throw new KeyNotFoundException(
                "Le bien demandé est introuvable ou indisponible.");
        }

        await _repository.AddAsync(
            utilisateurId,
            bienId,
            cancellationToken);
    }

    public async Task RemoveAsync(
        string identityUserId,
        int bienId,
        CancellationToken cancellationToken = default)
    {
        ValidateBienId(bienId);

        var utilisateurId = await GetUtilisateurIdAsync(
            identityUserId,
            cancellationToken);

        await _repository.RemoveAsync(
            utilisateurId,
            bienId,
            cancellationToken);
    }

    private async Task<int> GetUtilisateurIdAsync(
        string identityUserId,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(identityUserId))
        {
            throw new UnauthorizedAccessException(
                "L'utilisateur doit être authentifié.");
        }

        var utilisateurId = await _repository.FindUtilisateurIdAsync(
            identityUserId,
            cancellationToken);

        if (utilisateurId is null)
        {
            throw new UnauthorizedAccessException(
                "Aucun profil utilisateur associé à ce compte.");
        }

        return utilisateurId.Value;
    }

    private static void ValidateBienId(int bienId)
    {
        if (bienId <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(bienId),
                "L'identifiant du bien doit être positif.");
        }
    }
}