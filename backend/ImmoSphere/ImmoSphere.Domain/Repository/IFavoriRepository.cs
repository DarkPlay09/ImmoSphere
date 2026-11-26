namespace ImmoSphere.Domain.Repository;

public interface IFavoriRepository
{
    Task<int?> FindUtilisateurIdAsync(
        string identityUserId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<int>> GetBienIdsAsync(
        int utilisateurId,
        CancellationToken cancellationToken = default);

    Task<bool> IsPublishedBienAsync(
        int bienId,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(
        int utilisateurId,
        int bienId,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        int utilisateurId,
        int bienId,
        CancellationToken cancellationToken = default);

    Task RemoveAsync(
        int utilisateurId,
        int bienId,
        CancellationToken cancellationToken = default);
}