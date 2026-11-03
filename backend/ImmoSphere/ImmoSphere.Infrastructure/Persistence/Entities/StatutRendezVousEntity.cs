namespace ImmoSphere.Infrastructure.Persistence.Entities;

// Propriétés tirées du MCD V3 ; types et nullabilités à valider avec le MLD/SQL.
public class StatutRendezVousEntity
{
    public int Id { get; set; }
    public string Libelle { get; set; } = string.Empty;

    // Relations EF Core (choix à vérifier contre le MLD Looping)
    public ICollection<RendezVousEntity> RendezVous { get; set; } = new List<RendezVousEntity>();
}
