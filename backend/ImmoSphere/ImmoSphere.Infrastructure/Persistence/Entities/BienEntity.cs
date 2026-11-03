namespace ImmoSphere.Infrastructure.Persistence.Entities;

// Propriétés tirées du MCD V3 ; types et nullabilités à valider avec le MLD/SQL.
public class BienEntity
{
    public int Id { get; set; }
    public string Titre { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Rue { get; set; }
    public string? Numero { get; set; }
    public string? CodePostal { get; set; }
    public string? Localite { get; set; }
    public string? Vue360 { get; set; }
    public int? AnneeConstr { get; set; }
    public decimal? ConsEnergie { get; set; }
    public string? NumPeb { get; set; }
    public string? CheminPeb { get; set; }
    public decimal? Prix { get; set; }
    public int? Etage { get; set; }
    public string? Boite { get; set; }
    public decimal? SurfaceHab { get; set; }
    public decimal? SurfaceJard { get; set; }
    public decimal? SurfaceTerrain { get; set; }
    public decimal? SurfaceTerrasse { get; set; }
    public int? NbChambres { get; set; }
    public int? NbSdb { get; set; }
    public int? NbToilettes { get; set; }
    public int? NbEtage { get; set; }
    public bool? AGarage { get; set; }
    public bool? AParking { get; set; }
    public bool? AJardin { get; set; }
    public bool? ATerrasse { get; set; }
    public bool? ABalcon { get; set; }
    public bool? ACave { get; set; }
    public bool? AGrenier { get; set; }
    public bool? AAscenseur { get; set; }
    public bool? APiscine { get; set; }
    public bool? ACheminee { get; set; }
    public bool? EstVisible { get; set; }
    public bool? EstBrouillon { get; set; }
    public bool? EstAdresseConfidentielle { get; set; }

    // Relations EF Core (choix à vérifier contre le MLD Looping)
    public int? TypeBienId { get; set; }
    public TypeBienEntity? TypeBien { get; set; }

    public int? PebBienId { get; set; }
    public PebBienEntity? PebBien { get; set; }

    public int? TypeTransactionId { get; set; }
    public TypeTransactionEntity? TypeTransaction { get; set; }

    public int? EtatId { get; set; }
    public EtatEntity? Etat { get; set; }

    public int? EtatVenteId { get; set; }
    public EtatVenteEntity? EtatVente { get; set; }

    public int? TypeConfigurationId { get; set; }
    public TypeConfigurationEntity? TypeConfiguration { get; set; }

    public int? ProvinceId { get; set; }
    public ProvinceEntity? Province { get; set; }

    public int? TypeChauffageId { get; set; }
    public TypeChauffageEntity? TypeChauffage { get; set; }

    public int? PublieParId { get; set; }
    public UtilisateurEntity? PubliePar { get; set; }

    public ICollection<ImageEntity> Images { get; set; } = new List<ImageEntity>();

    public ICollection<RendezVousEntity> RendezVous { get; set; } = new List<RendezVousEntity>();

    public ICollection<DisponibiliteEntity> Disponibilites { get; set; } = new List<DisponibiliteEntity>();

    public ICollection<FavoriEntity> Favoris { get; set; } = new List<FavoriEntity>();

    public ICollection<BienInformationAnnexeEntity> InformationsAnnexes { get; set; } = new List<BienInformationAnnexeEntity>();
}
