using ImmoSphere.Domain.Core.Bien;
using ImmoSphere.Infrastructure.Persistence.Entities;

namespace ImmoSphere.Infrastructure.Mappers;

public static class BienMapper
{
    public static Bien BienToDomain(BienEntity entity)
    {
        Bien result = new Bien();

        result.Id = entity.Id;
        result.Titre = entity.Titre;
        result.Description = entity.Description ?? string.Empty;

        result.Rue = entity.Rue ?? string.Empty;
        result.Numero = int.TryParse(entity.Numero, out int numero)
            ? numero
            : 0;
        result.CodePostal = int.TryParse(entity.CodePostal, out int codePostal)
            ? codePostal
            : 0;
        result.Localite = entity.Localite ?? string.Empty;
        result.Boite = entity.Boite ?? string.Empty;

        // ==========================================
        // CARACTÉRISTIQUES DU BIEN
        // ==========================================

        result.AnneeConstruction = entity.AnneeConstr ?? 0;
        result.ConsEnergie = (double)(entity.ConsEnergie ?? 0);
        result.NumPeb = entity.NumPeb ?? string.Empty;
        result.Prix = (double)(entity.Prix ?? 0);
        result.Etage = entity.Etage ?? 0;

        // ==========================================
        // SURFACES
        // ==========================================

        result.SurfaceHab = (double)(entity.SurfaceHab ?? 0);
        result.SurfaceJard = (double)(entity.SurfaceJard ?? 0);
        result.SurfaceTerrain = (double)(entity.SurfaceTerrain ?? 0);
        result.SurfaceTerrasse = (double)(entity.SurfaceTerrasse ?? 0);

        // ==========================================
        // NOMBRE DE PIÈCES
        // ==========================================

        result.NbChambres = entity.NbChambres ?? 0;
        result.NbSdb = entity.NbSdb ?? 0;
        result.NbToilettes = entity.NbToilettes ?? 0;
        result.NbEtage = entity.NbEtage ?? 0;

        // ==========================================
        // ÉQUIPEMENTS
        // ==========================================

        result.Garage = entity.AGarage ?? false;
        result.Parking = entity.AParking ?? false;
        result.Jardin = entity.AJardin ?? false;
        result.Balcon = entity.ABalcon ?? false;
        result.Cave = entity.ACave ?? false;
        result.Grenier = entity.AGrenier ?? false;
        result.Ascenseur = entity.AAscenseur ?? false;
        result.Piscine = entity.APiscine ?? false;
        result.Cheminee = entity.ACheminee ?? false;
        result.Terrasse = entity.ATerrasse ?? false;


        result.IsVisible = entity.EstVisible ?? false;
        result.IsBrouillon = entity.EstBrouillon ?? false;
        result.AdresseConfidentielle =
            entity.EstAdresseConfidentielle ?? false;

        // ==========================================
        // TABLES DE RÉFÉRENCE
        // ==========================================

        // TODO : vérifier les propriétés des entités liées
        // pour récupérer le nom ou libellé correspondant.

        result.TypeBien = string.Empty;
        result.Peb = string.Empty;
        result.TypeTransaction = string.Empty;
        result.Etat = string.Empty;
        result.EtatVente = string.Empty;
        result.TypeConfiguration = string.Empty;
        result.Province = string.Empty;
        result.TypeChauffage = string.Empty;

        // result.Publicator = ...
        // result.Images = ...

        // TODO : mapper RendezVousEntity vers RendezVous
        var allrdv = new List<RendezVous>();
        foreach (var rendezVous in entity.RendezVous)
        {
            RendezVous rdv = new RendezVous();
            rdv.Date = rendezVous.DateHeure;
            rdv.Statut = rendezVous.StatutRendezVous.Libelle;
            allrdv.Add(rdv);
        }

        result.RendezVous = allrdv;

        // TODO : mapper DisponibiliteEntity vers Disponibilite
        var allDisponibilite = new List<Disponibilite>();
        foreach (var disponibilite in entity.Disponibilites)
        {
            Disponibilite disp = new Disponibilite();
            disp.Date = disponibilite.Date;
            disp.Time = disponibilite.Heure;
            disp.State = disponibilite.StatutDisponibilite.Libelle;
            allDisponibilite.Add(disp);
        }

        result.Disponibilites = allDisponibilite;


        // result.Favoris = ...

        // TODO : compter les favoris
        result.nbFavori = entity.Favoris.Count;

        // TODO : mapper BienInformationAnnexeEntity
        var allInf = new List<InformationAnnexe>();
        foreach (var information in entity.InformationsAnnexes)
        {
            InformationAnnexe inf = new InformationAnnexe();
            inf.Information = information.InformationAnnexe.Libelle;
            allInf.Add(inf);
        }

        result.InformationAnnexes = allInf;

        return result;
    }
}