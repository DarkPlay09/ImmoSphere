namespace ImmoSphere.Infrastructure.Persistence.Entities;

// Propriétés tirées du MCD V3 ; types et nullabilités à valider avec le MLD/SQL.
public class RoleEntity
{
    public int Id { get; set; }
    public string Libelle { get; set; } = string.Empty;

    // Relations EF Core (choix à vérifier contre le MLD Looping)
    public ICollection<UtilisateurEntity> Utilisateurs { get; set; } = new List<UtilisateurEntity>();
}
