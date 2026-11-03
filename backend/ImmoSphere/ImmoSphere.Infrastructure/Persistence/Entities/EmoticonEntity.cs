namespace ImmoSphere.Infrastructure.Persistence.Entities;

// Propriétés tirées du MCD V3 ; types et nullabilités à valider avec le MLD/SQL.
public class EmoticonEntity
{
    public int Id { get; set; }
    public string Chemin { get; set; } = string.Empty;

    // Relations EF Core (choix à vérifier contre le MLD Looping)
    public ICollection<SpecificationEntity> Specifications { get; set; } = new List<SpecificationEntity>();
}
