namespace ImmoSphere.Infrastructure.Persistence.Entities;

// Table de jonction explicite (association N-N supposée : à vérifier dans le MLD).
public class FavoriEntity
{
    public int UtilisateurId { get; set; }
    public UtilisateurEntity Utilisateur { get; set; } = null!;

    public int BienId { get; set; }
    public BienEntity Bien { get; set; } = null!;
}
