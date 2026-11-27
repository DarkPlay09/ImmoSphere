namespace ImmoSphere.Infrastructure.Persistence.Entities;

// Propriétés tirées du MCD V3 ; types et nullabilités à valider avec le MLD/SQL.
public class ImageEntity
{
    public int Id { get; set; }
    public string Chemin { get; set; } = string.Empty;
    public int Ordre { get; set; }
    public string TexteAlternatif { get; set; } = string.Empty;

    // Relations EF Core (choix à vérifier contre le MLD Looping)
    public int? BienId { get; set; }
    public BienEntity? Bien { get; set; }
}
