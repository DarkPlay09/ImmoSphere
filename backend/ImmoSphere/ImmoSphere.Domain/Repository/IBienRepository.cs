using ImmoSphere.Domain.Core.Bien;

namespace ImmoSphere.Domain.Repository;

public interface IBienRepository
{
    // Task → opération asynchrone
    // CancellationToken → transmet l'annulation depuis la requête HTTP jusqu'à la BD
    public Task<Bien> GetBienByIdAsync(int id, CancellationToken cancellationToken);
}