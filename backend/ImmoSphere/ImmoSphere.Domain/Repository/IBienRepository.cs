using ImmoSphere.Domain.Core.Bien;

namespace ImmoSphere.Domain.Repository;

public interface IBienRepository
{
    // Task → opération asynchrone
    // CancellationToken → transmet l'annulation depuis la requête HTTP jusqu'à la BD
    public Task<Bien> GetBienByIdAsync(int id, CancellationToken cancellationToken);

    // Récupère les biens uniquement visibles et publiés
    public Task<Bien> GetPublishedBienByIdAsync(int id, CancellationToken cancellationToken);
    
    /// <summary>
    /// Recherche les biens visibles et publiés avec filtres, tri et pagination.
    /// </summary>
    Task<ResultatRechercheBiens> SearchAsync(CriteresRechercheBiens criteres, CancellationToken cancellationToken);
}