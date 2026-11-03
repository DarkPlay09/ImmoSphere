namespace ImmoSphere.Infrastructure.Persistence.Entities;

// Propriétés tirées du MCD V3 ; types et nullabilités à valider avec le MLD/SQL.
public class FaqEntity
{
    public int Id { get; set; }
    public string Titre { get; set; } = string.Empty;
    public string? Libelle { get; set; }

    // Relations EF Core (choix à vérifier contre le MLD Looping)
    public int? UtilisateurId { get; set; }
    public UtilisateurEntity? Utilisateur { get; set; }
}
