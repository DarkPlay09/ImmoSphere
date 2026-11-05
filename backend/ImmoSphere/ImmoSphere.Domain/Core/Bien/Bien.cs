namespace ImmoSphere.Domain.Core.Bien;

public class Bien
{
    public int Id { get; set; }
    public string Titre { get; set; }
    public string Description { get; set; }
    public string Rue  { get; set; }
    public int Numero { get; set; }
    public int CodePostal { get; set; }
    public string Localite { get; set; }
    public int AnneeConstruction { get; set; }
    public double ConsEnergie { get; set; }
    public string NumPeb { get; set; }
    public double Prix { get; set; }
    public int Etage { get; set; }
    public string Boite { get; set; }
    public double SurfaceHab { get; set; }
    public double SurfaceJard { get; set; }
    public double SurfaceTerrain { get; set; }
    public double SurfaceTerrasse { get; set; }
    public int NbChambres { get; set; }
    public int NbSdb { get; set; }
    public int NbToilettes { get; set; }
    public int NbEtage { get; set; }
    public bool Garage { get; set; }
    public bool Parking { get; set; }
    public bool Jardin { get; set; }
    public bool Balcon { get; set; }
    public bool Cave { get; set; }
    public bool Terrasse { get; set; }
    public bool Grenier { get; set; }
    public bool Ascenseur { get; set; }
    public bool Piscine { get; set; }
    public bool Cheminee { get; set; }
    public bool IsVisible { get; set; }
    public bool IsBrouillon { get; set; }
    public bool AdresseConfidentielle { get; set; }
    public string TypeBien { get; set; }
    public string Peb { get; set; }
    public string TypeTransaction { get; set; }
    public string Etat { get; set; }
    public string EtatVente { get; set; }
    public string TypeConfiguration { get; set; }
    public string Province { get; set; }
    public string TypeChauffage { get; set; }
    // public User Publicator { get; set; } Todo : décommenter quand se sera mis en place
    // public IList<Images>  Images { get; set; }
    public IList<RendezVous>  RendezVous { get; set; }
    public IList<Disponibilite>  Disponibilites { get; set; }
    // public IList<Favori>  Favoris { get; set; } A voir comment représenter ça, car many to many
    public int nbFavori { get; set; }
    public IList<InformationAnnexe>  InformationAnnexes { get; set; }

 }
