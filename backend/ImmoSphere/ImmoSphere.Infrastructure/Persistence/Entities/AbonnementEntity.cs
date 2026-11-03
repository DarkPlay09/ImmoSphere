namespace ImmoSphere.Infrastructure.Persistence.Entities;

// Propriétés tirées du MCD V3 ; types et nullabilités à valider avec le MLD/SQL.
public class AbonnementEntity
{
    public int Id { get; set; }
    public string Nom { get; set; } = string.Empty;
    public decimal? Prix { get; set; }
    public int? Duree { get; set; }

    // Relations EF Core (choix à vérifier contre le MLD Looping)
    public ICollection<SouscriptionEntity> Souscriptions { get; set; } = new List<SouscriptionEntity>();
}
