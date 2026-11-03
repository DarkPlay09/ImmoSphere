namespace ImmoSphere.Infrastructure.Persistence.Entities;

// Propriétés tirées du MCD V3 ; types et nullabilités à valider avec le MLD/SQL.
public class DemandeCreationAgenceEntity
{
    public int Id { get; set; }
    public string Nom { get; set; } = string.Empty;
    public string? Description { get; set; }

    // Relations EF Core (choix à vérifier contre le MLD Looping)
    public int? UtilisateurId { get; set; }
    public UtilisateurEntity? Utilisateur { get; set; }
}
