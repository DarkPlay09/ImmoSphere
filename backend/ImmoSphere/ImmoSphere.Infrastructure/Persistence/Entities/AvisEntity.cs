namespace ImmoSphere.Infrastructure.Persistence.Entities;

// Propriétés tirées du MCD V3 ; types et nullabilités à valider avec le MLD/SQL.
public class AvisEntity
{
    public int Id { get; set; }
    public string? Libelle { get; set; }
    public int? NbEtoiles { get; set; }

    // Relations EF Core (choix à vérifier contre le MLD Looping)
    public int? AuteurId { get; set; }
    public UtilisateurEntity? Auteur { get; set; }

    public int? UtilisateurEvalueId { get; set; }
    public UtilisateurEntity? UtilisateurEvalue { get; set; }
}
