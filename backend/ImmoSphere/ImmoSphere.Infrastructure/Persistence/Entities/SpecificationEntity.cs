namespace ImmoSphere.Infrastructure.Persistence.Entities;

// Propriétés tirées du MCD V3 ; types et nullabilités à valider avec le MLD/SQL.
public class SpecificationEntity
{
    public int Id { get; set; }
    public string Titre { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Emoticon { get; set; }

    // Relations EF Core (choix à vérifier contre le MLD Looping)
    public int? EmoticonId { get; set; }
    public EmoticonEntity? EmoticonReference { get; set; }

    public ICollection<AgenceSpecificationEntity> Agences { get; set; } = new List<AgenceSpecificationEntity>();
}
