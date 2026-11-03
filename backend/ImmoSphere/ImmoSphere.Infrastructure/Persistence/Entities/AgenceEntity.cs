namespace ImmoSphere.Infrastructure.Persistence.Entities;

// Propriétés tirées du MCD V3 ; types et nullabilités à valider avec le MLD/SQL.
public class AgenceEntity
{
    public int Id { get; set; }
    public string Nom { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Logo { get; set; }
    public string? ImgBackground { get; set; }
    public string? Localite { get; set; }
    public string? Rue { get; set; }
    public string? Numero { get; set; }
    public string? CodePostal { get; set; }
    public string? NumeroTel { get; set; }
    public string? Mail { get; set; }
    public string? LienPlateforme { get; set; }
    public string? Bce { get; set; }

    // Relations EF Core (choix à vérifier contre le MLD Looping)
    public ICollection<UtilisateurEntity> Membres { get; set; } = new List<UtilisateurEntity>();

    public ICollection<AgenceAdministrateurEntity> Administrateurs { get; set; } = new List<AgenceAdministrateurEntity>();

    public ICollection<AgenceSpecificationEntity> Specifications { get; set; } = new List<AgenceSpecificationEntity>();
}
