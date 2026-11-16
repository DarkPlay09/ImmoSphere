using ImmoSphere.Domain.Core.Bien;

namespace ImmoSphere.Domain.Tests.Core.Bien;

[TestClass]
public sealed class BienTest
{
    [TestMethod]
    public void ConfidentialAddressShouldHideStreetNumberAndBox()
    {
        var bien = new Domain.Core.Bien.Bien
        {
            Rue = "Rue Saint-Gilles",
            Numero = 42,
            Boite = "B3",
            CodePostal = 4000,
            Localite = "Liège",
            Province = "Liège",
            AdresseConfidentielle = true
        };

        AdressePublique adresse = bien.ObtenirAdressePublique();

        Assert.IsTrue(adresse.EstConfidentielle);
        Assert.IsNull(adresse.Rue);
        Assert.IsNull(adresse.Numero);
        Assert.IsNull(adresse.Boite);
        Assert.AreEqual(4000, adresse.CodePostal);
        Assert.AreEqual("Liège", adresse.Localite);
        Assert.AreEqual("Liège", adresse.Province);
    }

    [TestMethod]
    public void PublicAddressShouldExposeCompleteAddress()
    {
        var bien = new Domain.Core.Bien.Bien
        {
            Rue = "Rue Saint-Gilles",
            Numero = 42,
            Boite = "B3",
            CodePostal = 4000,
            Localite = "Liège",
            Province = "Liège",
            AdresseConfidentielle = false
        };

        AdressePublique adresse = bien.ObtenirAdressePublique();

        Assert.IsFalse(adresse.EstConfidentielle);
        Assert.AreEqual("Rue Saint-Gilles", adresse.Rue);
        Assert.AreEqual(42, adresse.Numero);
        Assert.AreEqual("B3", adresse.Boite);
        Assert.AreEqual(4000, adresse.CodePostal);
        Assert.AreEqual("Liège", adresse.Localite);
        Assert.AreEqual("Liège", adresse.Province);
    }
}
