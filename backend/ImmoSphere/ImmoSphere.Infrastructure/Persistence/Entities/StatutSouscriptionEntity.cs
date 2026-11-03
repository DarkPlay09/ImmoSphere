namespace ImmoSphere.Infrastructure.Persistence.Entities;

// Propriétés tirées du MCD V3 ; types et nullabilités à valider avec le MLD/SQL.
public class StatutSouscriptionEntity
{
    public int Id { get; set; }
    public string Libelle { get; set; } = string.Empty;

    // Relations EF Core (choix à vérifier contre le MLD Looping)
    public ICollection<SouscriptionEntity> Souscriptions { get; set; } = new List<SouscriptionEntity>();
}
