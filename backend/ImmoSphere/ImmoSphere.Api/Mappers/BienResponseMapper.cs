using ImmoSphere.Api.Dtos.Biens;
using ImmoSphere.Domain.Core.Bien;

namespace ImmoSphere.Api.Mappers;

public static class BienResponseMapper
{
    public static BienDetailResponseDto ToDetailResponseDto(Bien bien)
    {
        ArgumentNullException.ThrowIfNull(bien);
        AdressePublique adresse =
            bien.ObtenirAdressePublique();

        return new BienDetailResponseDto
        {
            Id = bien.Id,
            Titre = bien.Titre,
            Description = bien.Description,
            Prix = bien.Prix,
            CodePostal = adresse.CodePostal,
            Localite = adresse.Localite,
            Province = adresse.Province,
            AdresseConfidentielle = adresse.EstConfidentielle,
            Rue = adresse.Rue,
            Numero = adresse.Numero,
            Boite = adresse.Boite,
            TypeBien = bien.TypeBien,
            TypeTransaction = bien.TypeTransaction,
            Peb = bien.Peb,
            NombreFavoris = bien.nbFavori,
            InformationsAnnexes = bien.InformationAnnexes
                .Select(information => information.Information)
                .ToList(),
            Caracteristiques = new CaracteristiquesBienResponseDto
            {
                AnneeConstruction = bien.AnneeConstruction,
                ConsommationEnergie = bien.ConsEnergie,
                NumeroPeb = bien.NumPeb,
                Etat = bien.Etat,
                EtatVente = bien.EtatVente,
                TypeConfiguration = bien.TypeConfiguration,
                TypeChauffage = bien.TypeChauffage,
                SurfaceHabitable = bien.SurfaceHab,
                SurfaceTerrain = bien.SurfaceTerrain,
                SurfaceJardin = bien.SurfaceJard,
                SurfaceTerrasse = bien.SurfaceTerrasse,
                Etage = bien.Etage,
                NombreEtages = bien.NbEtage,
                NombreChambres = bien.NbChambres,
                NombreSallesDeBain = bien.NbSdb,
                NombreToilettes = bien.NbToilettes
            },
            Equipements = new EquipementsBienResponseDto
            {
                Garage = bien.Garage,
                Parking = bien.Parking,
                Jardin = bien.Jardin,
                Balcon = bien.Balcon,
                Cave = bien.Cave,
                Terrasse = bien.Terrasse,
                Grenier = bien.Grenier,
                Ascenseur = bien.Ascenseur,
                Piscine = bien.Piscine,
                Cheminee = bien.Cheminee
            }
        };
    }
}