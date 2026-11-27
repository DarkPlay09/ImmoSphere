using ImmoSphere.Api.Dtos.Biens;
using ImmoSphere.Domain.Core.Bien;

namespace ImmoSphere.Api.Mappers;

public static class BienResponseMapper
{
    // ==========================================
    // DÉTAIL D'UN BIEN
    // ==========================================

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
            Images = bien.Images
                .OrderBy(image => image.Ordre)
                .Select(image => new ImageBienResponseDto
                {
                    Url = image.Chemin,
                    Ordre = image.Ordre,
                    TexteAlternatif = image.TexteAlternatif
                })
                .ToList(),
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


    // ==========================================
    // RÉSULTATS DE RECHERCHE
    // ==========================================

    public static RechercheBiensResponseDto ToSearchResponseDto(ResultatRechercheBiens resultat)
    {
        ArgumentNullException.ThrowIfNull(resultat);

        return new RechercheBiensResponseDto
        {
            Biens = resultat.Biens
                .Select(ToSearchItemResponseDto)
                .ToArray(),

            Total = resultat.Total,
            Page = resultat.Page,
            TaillePage = resultat.TaillePage
        };
    }


    // ==========================================
    // CARTE D'UN BIEN
    // ==========================================

    private static BienRechercheItemResponseDto ToSearchItemResponseDto(BienRechercheResume bien)
    {
        return new BienRechercheItemResponseDto
        {
            Id = bien.Id,

            Titre = bien.Titre,
            Description = bien.Description,
            Prix = bien.Prix,

            CodePostal = bien.CodePostal,
            Localite = bien.Localite,
            Province = bien.Province,

            AdresseConfidentielle = bien.AdresseConfidentielle,

            TypeBien = bien.TypeBien,
            TypeTransaction = bien.TypeTransaction,
            Peb = bien.Peb,

            SurfaceHabitable = bien.SurfaceHabitable,
            NombreChambres = bien.NombreChambres,
            NombreSallesDeBains = bien.NombreSallesDeBain,

            ImagePrincipale = bien.ImagePrincipale,
            NombrePhotos = bien.NombrePhotos
        };
    }
}