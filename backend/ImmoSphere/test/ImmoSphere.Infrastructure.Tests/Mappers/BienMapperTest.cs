using ImmoSphere.Domain.Core.Bien;
using ImmoSphere.Infrastructure.Mappers;
using ImmoSphere.Infrastructure.Persistence.Entities;

namespace ImmoSphere.Infrastructure.Tests.Mappers;

[TestClass]
public sealed class BienMapperTest
{
    [TestMethod]
    public void EntityShouldBeMappedToCompleteDomainBien()
    {
        var entity = CompleteEntity();

        Bien bien = BienMapper.BienToDomain(entity);

        Assert.AreEqual(42, bien.Id);
        Assert.AreEqual("Maison familiale", bien.Titre);
        Assert.AreEqual("Une maison lumineuse", bien.Description);
        Assert.AreEqual("Rue Saint-Gilles", bien.Rue);
        Assert.AreEqual(12, bien.Numero);
        Assert.AreEqual(4000, bien.CodePostal);
        Assert.AreEqual("Liège", bien.Localite);
        Assert.AreEqual("B2", bien.Boite);
        Assert.AreEqual(1998, bien.AnneeConstruction);
        Assert.AreEqual(178.4d, bien.ConsEnergie);
        Assert.AreEqual("PEB-123", bien.NumPeb);
        Assert.AreEqual(325000d, bien.Prix);
        Assert.AreEqual(145.5d, bien.SurfaceHab);
        Assert.AreEqual(120d, bien.SurfaceJard);
        Assert.AreEqual(350d, bien.SurfaceTerrain);
        Assert.AreEqual(24d, bien.SurfaceTerrasse);
        Assert.AreEqual(4, bien.NbChambres);
        Assert.IsTrue(bien.Garage);
        Assert.IsTrue(bien.Jardin);
        Assert.IsFalse(bien.Parking);
        Assert.IsTrue(bien.IsVisible);
        Assert.IsFalse(bien.IsBrouillon);
        Assert.IsTrue(bien.AdresseConfidentielle);
        Assert.AreEqual("Maison", bien.TypeBien);
        Assert.AreEqual("B", bien.Peb);
        Assert.AreEqual("Vente", bien.TypeTransaction);
        Assert.AreEqual("Bon état", bien.Etat);
        Assert.AreEqual("Disponible", bien.EtatVente);
        Assert.AreEqual("Trois façades", bien.TypeConfiguration);
        Assert.AreEqual("Liège", bien.Province);
        Assert.AreEqual("Gaz", bien.TypeChauffage);
        Assert.AreEqual(2, bien.Images.Count);
        Assert.AreEqual("/images/properties/demo/maison.png", bien.Images[0].Chemin);
        Assert.AreEqual(0, bien.Images[0].Ordre);
        Assert.AreEqual("Façade principale", bien.Images[0].TexteAlternatif);
        Assert.AreEqual("/images/properties/demo/interieur.png", bien.Images[1].Chemin);
        Assert.AreEqual(1, bien.RendezVous.Count);
        Assert.AreEqual("Confirmé", bien.RendezVous[0].Statut);
        Assert.AreEqual(1, bien.Disponibilites.Count);
        Assert.AreEqual("Libre", bien.Disponibilites[0].State);
        Assert.AreEqual(2, bien.nbFavori);
        Assert.AreEqual(1, bien.InformationAnnexes.Count);
        Assert.AreEqual(
            "Proche des transports",
            bien.InformationAnnexes[0].Information);
    }

    [TestMethod]
    public void MissingOptionalValuesShouldUseSafeDefaults()
    {
        var entity = new BienEntity
        {
            Titre = "Bien minimal",
            Numero = "invalide",
            CodePostal = "invalide"
        };

        Bien bien = BienMapper.BienToDomain(entity);

        Assert.AreEqual(string.Empty, bien.Description);
        Assert.AreEqual(string.Empty, bien.Rue);
        Assert.AreEqual(0, bien.Numero);
        Assert.AreEqual(0, bien.CodePostal);
        Assert.AreEqual(0d, bien.Prix);
        Assert.IsFalse(bien.Garage);
        Assert.IsFalse(bien.IsVisible);
        Assert.AreEqual(string.Empty, bien.TypeBien);
        Assert.AreEqual(string.Empty, bien.Etat);
        Assert.AreEqual(0, bien.Images.Count);
        Assert.AreEqual(0, bien.RendezVous.Count);
        Assert.AreEqual(0, bien.Disponibilites.Count);
        Assert.AreEqual(0, bien.InformationAnnexes.Count);
    }

    private static BienEntity CompleteEntity()
    {
        return new BienEntity
        {
            Id = 42,
            Titre = "Maison familiale",
            Description = "Une maison lumineuse",
            Rue = "Rue Saint-Gilles",
            Numero = "12",
            CodePostal = "4000",
            Localite = "Liège",
            Boite = "B2",
            AnneeConstr = 1998,
            ConsEnergie = 178.4m,
            NumPeb = "PEB-123",
            Prix = 325000m,
            Etage = 2,
            SurfaceHab = 145.5m,
            SurfaceJard = 120m,
            SurfaceTerrain = 350m,
            SurfaceTerrasse = 24m,
            NbChambres = 4,
            NbSdb = 2,
            NbToilettes = 3,
            NbEtage = 3,
            AGarage = true,
            AParking = false,
            AJardin = true,
            ATerrasse = true,
            ABalcon = false,
            ACave = true,
            AGrenier = false,
            AAscenseur = true,
            APiscine = false,
            ACheminee = true,
            EstVisible = true,
            EstBrouillon = false,
            EstAdresseConfidentielle = true,
            TypeBien = new TypeBienEntity { Libelle = "Maison" },
            PebBien = new PebBienEntity { Libelle = "B" },
            TypeTransaction = new TypeTransactionEntity { Libelle = "Vente" },
            Etat = new EtatEntity { Libelle = "Bon état" },
            EtatVente = new EtatVenteEntity { Libelle = "Disponible" },
            TypeConfiguration = new TypeConfigurationEntity { Libelle = "Trois façades" },
            Province = new ProvinceEntity { Libelle = "Liège" },
            TypeChauffage = new TypeChauffageEntity { Libelle = "Gaz" },
            Images =
            [
                new ImageEntity
                {
                    Chemin = "/images/properties/demo/interieur.png",
                    Ordre = 1,
                    TexteAlternatif = "Pièce de vie"
                },
                new ImageEntity
                {
                    Chemin = "/images/properties/demo/maison.png",
                    Ordre = 0,
                    TexteAlternatif = "Façade principale"
                }
            ],
            RendezVous =
            [
                new RendezVousEntity
                {
                    DateHeure = new DateTime(2026, 11, 20, 14, 30, 0),
                    StatutRendezVous = new StatutRendezVousEntity
                    {
                        Libelle = "Confirmé"
                    }
                }
            ],
            Disponibilites =
            [
                new DisponibiliteEntity
                {
                    Date = new DateOnly(2026, 11, 20),
                    Heure = new TimeOnly(14, 30),
                    StatutDisponibilite = new StatutDisponibiliteEntity
                    {
                        Libelle = "Libre"
                    }
                }
            ],
            Favoris = [new FavoriEntity(), new FavoriEntity()],
            InformationsAnnexes =
            [
                new BienInformationAnnexeEntity
                {
                    InformationAnnexe = new InformationAnnexeEntity
                    {
                        Libelle = "Proche des transports"
                    }
                }
            ]
        };
    }
}
