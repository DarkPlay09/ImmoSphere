using ImmoSphere.Api.Dtos.Biens;
using ImmoSphere.Api.Mappers;
using ImmoSphere.Domain.Core.Bien;

namespace ImmoSphere.Api.Tests.Mappers;

[TestClass]
public sealed class BienResponseMapperTest
{
    [TestMethod]
    public void BienShouldBeMappedToCompleteDetailResponse()
    {
        var bien = CompleteBien();

        BienDetailResponseDto response =
            BienResponseMapper.ToDetailResponseDto(bien);

        Assert.AreEqual(42, response.Id);
        Assert.AreEqual("Maison familiale", response.Titre);
        Assert.AreEqual("Une maison lumineuse", response.Description);
        Assert.AreEqual(325000d, response.Prix);
        Assert.AreEqual("Rue Saint-Gilles", response.Rue);
        Assert.AreEqual(12, response.Numero);
        Assert.AreEqual("B2", response.Boite);
        Assert.AreEqual(4000, response.CodePostal);
        Assert.AreEqual("Liège", response.Localite);
        Assert.AreEqual("Liège", response.Province);
        Assert.IsFalse(response.AdresseConfidentielle);
        Assert.AreEqual("Maison", response.TypeBien);
        Assert.AreEqual("Vente", response.TypeTransaction);
        Assert.AreEqual("B", response.Peb);
        Assert.AreEqual(2, response.Images.Count);
        Assert.AreEqual("/images/properties/demo/maison.png", response.Images[0].Url);
        Assert.AreEqual(0, response.Images[0].Ordre);
        Assert.AreEqual("Façade principale", response.Images[0].TexteAlternatif);
        Assert.AreEqual("/images/properties/demo/interieur.png", response.Images[1].Url);
        Assert.AreEqual(7, response.NombreFavoris);
        CollectionAssert.AreEqual(
            new[] { "Proche des transports", "Quartier calme" },
            response.InformationsAnnexes.ToArray());

        Assert.AreEqual(1998, response.Caracteristiques.AnneeConstruction);
        Assert.AreEqual(145.5d, response.Caracteristiques.SurfaceHabitable);
        Assert.AreEqual(350d, response.Caracteristiques.SurfaceTerrain);
        Assert.AreEqual(120d, response.Caracteristiques.SurfaceJardin);
        Assert.AreEqual(24d, response.Caracteristiques.SurfaceTerrasse);
        Assert.AreEqual(2, response.Caracteristiques.Etage);
        Assert.AreEqual(3, response.Caracteristiques.NombreEtages);
        Assert.AreEqual(4, response.Caracteristiques.NombreChambres);
        Assert.AreEqual(2, response.Caracteristiques.NombreSallesDeBain);
        Assert.AreEqual(3, response.Caracteristiques.NombreToilettes);
        Assert.AreEqual(178.4d, response.Caracteristiques.ConsommationEnergie);
        Assert.AreEqual("PEB-123", response.Caracteristiques.NumeroPeb);
        Assert.AreEqual("Bon état", response.Caracteristiques.Etat);
        Assert.AreEqual("Disponible", response.Caracteristiques.EtatVente);
        Assert.AreEqual("Trois façades", response.Caracteristiques.TypeConfiguration);
        Assert.AreEqual("Gaz", response.Caracteristiques.TypeChauffage);

        Assert.IsTrue(response.Equipements.Garage);
        Assert.IsFalse(response.Equipements.Parking);
        Assert.IsTrue(response.Equipements.Jardin);
        Assert.IsFalse(response.Equipements.Balcon);
        Assert.IsTrue(response.Equipements.Cave);
        Assert.IsTrue(response.Equipements.Terrasse);
        Assert.IsFalse(response.Equipements.Grenier);
        Assert.IsTrue(response.Equipements.Ascenseur);
        Assert.IsFalse(response.Equipements.Piscine);
        Assert.IsTrue(response.Equipements.Cheminee);
    }

    [TestMethod]
    public void ConfidentialAddressShouldNotBeExposed()
    {
        var bien = CompleteBien();
        bien.AdresseConfidentielle = true;

        BienDetailResponseDto response =
            BienResponseMapper.ToDetailResponseDto(bien);

        Assert.IsTrue(response.AdresseConfidentielle);
        Assert.IsNull(response.Rue);
        Assert.IsNull(response.Numero);
        Assert.IsNull(response.Boite);
        Assert.AreEqual(4000, response.CodePostal);
        Assert.AreEqual("Liège", response.Localite);
        Assert.AreEqual("Liège", response.Province);
    }

    [TestMethod]
    public void NullBienShouldBeRejected()
    {
        Assert.ThrowsExactly<ArgumentNullException>(
            () => BienResponseMapper.ToDetailResponseDto(null!));
    }

    private static Bien CompleteBien()
    {
        return new Bien
        {
            Id = 42,
            Titre = "Maison familiale",
            Description = "Une maison lumineuse",
            Prix = 325000,
            Rue = "Rue Saint-Gilles",
            Numero = 12,
            Boite = "B2",
            CodePostal = 4000,
            Localite = "Liège",
            Province = "Liège",
            AdresseConfidentielle = false,
            TypeBien = "Maison",
            TypeTransaction = "Vente",
            Peb = "B",
            Images =
            [
                new ImageBien(
                    "/images/properties/demo/interieur.png",
                    1,
                    "Pièce de vie"),
                new ImageBien(
                    "/images/properties/demo/maison.png",
                    0,
                    "Façade principale")
            ],
            nbFavori = 7,
            AnneeConstruction = 1998,
            SurfaceHab = 145.5,
            SurfaceTerrain = 350,
            SurfaceJard = 120,
            SurfaceTerrasse = 24,
            Etage = 2,
            NbEtage = 3,
            NbChambres = 4,
            NbSdb = 2,
            NbToilettes = 3,
            ConsEnergie = 178.4,
            NumPeb = "PEB-123",
            Etat = "Bon état",
            EtatVente = "Disponible",
            TypeConfiguration = "Trois façades",
            TypeChauffage = "Gaz",
            Garage = true,
            Parking = false,
            Jardin = true,
            Balcon = false,
            Cave = true,
            Terrasse = true,
            Grenier = false,
            Ascenseur = true,
            Piscine = false,
            Cheminee = true,
            InformationAnnexes =
            [
                new InformationAnnexe { Information = "Proche des transports" },
                new InformationAnnexe { Information = "Quartier calme" }
            ]
        };
    }
}
