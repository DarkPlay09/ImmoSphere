using ImmoSphere.Domain.Repository;
using ImmoSphere.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ImmoSphere.Infrastructure.Repositories;

public class FavoriRepository : IFavoriRepository
{
    private readonly ApplicationDbContext _context;

    public FavoriRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public Task<int?> FindUtilisateurIdAsync(
        string identityUserId,
        CancellationToken cancellationToken = default)
    {
        return _context.Utilisateurs
            .AsNoTracking()
            .Where(u => u.IdentityUserId == identityUserId)
            .Select(u => (int?)u.Id)
            .SingleOrDefaultAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<int>> GetBienIdsAsync(
        int utilisateurId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Favoris
            .AsNoTracking()
            .Where(f => f.UtilisateurId == utilisateurId)
            .OrderBy(f => f.BienId)
            .Select(f => f.BienId)
            .ToListAsync(cancellationToken);
    }

    public Task<bool> IsPublishedBienAsync(
        int bienId,
        CancellationToken cancellationToken = default)
    {
        return _context.Biens
            .AnyAsync(
                b => b.Id == bienId
                    && b.EstVisible == true
                    && b.EstBrouillon == false,
                cancellationToken);
    }

    public Task<bool> ExistsAsync(
        int utilisateurId,
        int bienId,
        CancellationToken cancellationToken = default)
    {
        return _context.Favoris
            .AnyAsync(
                f => f.UtilisateurId == utilisateurId
                    && f.BienId == bienId,
                cancellationToken);
    }

    public async Task AddAsync(
        int utilisateurId,
        int bienId,
        CancellationToken cancellationToken = default)
    {
        await _context.Database.ExecuteSqlInterpolatedAsync(
            $"""
             INSERT INTO favori (id_utilisateur, id_bien)
             VALUES ({utilisateurId}, {bienId})
             ON CONFLICT (id_utilisateur, id_bien)
             DO NOTHING
             """,
            cancellationToken);
    }

    public async Task RemoveAsync(
        int utilisateurId,
        int bienId,
        CancellationToken cancellationToken = default)
    {
        await _context.Favoris
            .Where(f => f.UtilisateurId == utilisateurId
                && f.BienId == bienId)
            .ExecuteDeleteAsync(cancellationToken);
    }
}