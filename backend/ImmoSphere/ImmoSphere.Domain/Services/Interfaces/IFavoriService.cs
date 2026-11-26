namespace ImmoSphere.Domain.Services.Interfaces;

public interface IFavoriService
{
    Task<IReadOnlyList<int>> GetBienIdsAsync(
        string identityUserId,
        CancellationToken cancellationToken = default);

    Task<bool> IsFavoriteAsync(
        string identityUserId,
        int bienId,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        string identityUserId,
        int bienId,
        CancellationToken cancellationToken = default);

    Task RemoveAsync(
        string identityUserId,
        int bienId,
        CancellationToken cancellationToken = default);
}