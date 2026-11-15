using ImmoSphere.Domain.Core.Bien;
using ImmoSphere.Infrastructure.Persistence;
using ImmoSphere.Infrastructure.Persistence.Entities;
using ImmoSphere.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;

namespace ImmoSphere.Infrastructure.Tests.Repositories;

[TestClass]
public sealed class BienRepositoryTest
{
    [TestMethod]
    public async Task VisiblePublishedBienShouldBeReturned()
    {
        await using var context = CreateContext();
        context.Biens.Add(BienEntityWithStatus(1, true, false));
        await context.SaveChangesAsync();
        var repository = CreateRepository(context);

        Bien bien = await repository.GetPublishedBienByIdAsync(
            1,
            CancellationToken.None);

        Assert.AreEqual(1, bien.Id);
        Assert.IsTrue(bien.IsVisible);
        Assert.IsFalse(bien.IsBrouillon);
    }

    [TestMethod]
    [DataRow(false, false)]
    [DataRow(true, true)]
    [DataRow(false, true)]
    public async Task UnpublishedBienShouldNotBeReturnedPublicly(
        bool isVisible,
        bool isDraft)
    {
        await using var context = CreateContext();
        context.Biens.Add(BienEntityWithStatus(2, isVisible, isDraft));
        await context.SaveChangesAsync();
        var repository = CreateRepository(context);

        await Assert.ThrowsExactlyAsync<KeyNotFoundException>(
            () => repository.GetPublishedBienByIdAsync(
                2,
                CancellationToken.None));
    }

    [TestMethod]
    public async Task UnrestrictedQueryShouldReturnDraftBien()
    {
        await using var context = CreateContext();
        context.Biens.Add(BienEntityWithStatus(3, false, true));
        await context.SaveChangesAsync();
        var repository = CreateRepository(context);

        Bien bien = await repository.GetBienByIdAsync(
            3,
            CancellationToken.None);

        Assert.AreEqual(3, bien.Id);
        Assert.IsTrue(bien.IsBrouillon);
    }

    [TestMethod]
    public async Task MissingBienShouldBeRejected()
    {
        await using var context = CreateContext();
        var repository = CreateRepository(context);

        await Assert.ThrowsExactlyAsync<KeyNotFoundException>(
            () => repository.GetBienByIdAsync(
                404,
                CancellationToken.None));
    }

    [TestMethod]
    public async Task RelatedDetailDataShouldBeLoadedAndMapped()
    {
        await using var context = CreateContext();
        var typeBien = new TypeBienEntity { Id = 1, Libelle = "Maison" };
        var information = new InformationAnnexeEntity
        {
            Id = 1,
            Libelle = "Quartier calme"
        };
        var entity = BienEntityWithStatus(5, true, false);
        entity.TypeBien = typeBien;
        entity.TypeBienId = typeBien.Id;
        entity.InformationsAnnexes.Add(
            new BienInformationAnnexeEntity
            {
                Bien = entity,
                BienId = entity.Id,
                InformationAnnexe = information,
                InformationAnnexeId = information.Id
            });
        context.Biens.Add(entity);
        await context.SaveChangesAsync();
        var repository = CreateRepository(context);

        Bien bien = await repository.GetPublishedBienByIdAsync(
            5,
            CancellationToken.None);

        Assert.AreEqual("Maison", bien.TypeBien);
        Assert.AreEqual(1, bien.InformationAnnexes.Count);
        Assert.AreEqual(
            "Quartier calme",
            bien.InformationAnnexes[0].Information);
    }

    private static ApplicationDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    private static BienRepository CreateRepository(
        ApplicationDbContext context)
    {
        return new BienRepository(
            context,
            NullLogger<BienRepository>.Instance);
    }

    private static BienEntity BienEntityWithStatus(
        int id,
        bool isVisible,
        bool isDraft)
    {
        return new BienEntity
        {
            Id = id,
            Titre = $"Bien {id}",
            EstVisible = isVisible,
            EstBrouillon = isDraft
        };
    }
}
