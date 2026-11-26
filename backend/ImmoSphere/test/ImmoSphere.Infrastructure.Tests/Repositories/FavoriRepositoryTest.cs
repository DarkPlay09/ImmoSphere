using ImmoSphere.Infrastructure.Persistence;
using ImmoSphere.Infrastructure.Persistence.Entities;
using ImmoSphere.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;

namespace ImmoSphere.Infrastructure.Tests.Repositories;

[TestClass]
public sealed class FavoriRepositoryTest
{
    [TestMethod]
    public async Task ShouldFindUtilisateurByIdentityId()
    {
        await using var context = CreateContext();

        context.Utilisateurs.Add(new UtilisateurEntity
        {
            Id = 1,
            Nom = "Test",
            Prenom = "Marc",
            IdentityUserId = "user-1"
        });

        await context.SaveChangesAsync();

        var repository = new FavoriRepository(context);

        var result = await repository.FindUtilisateurIdAsync(
            "user-1");

        Assert.AreEqual<int?>(1, result);
    }

    [TestMethod]
    public async Task UnknownIdentityShouldReturnNull()
    {
        await using var context = CreateContext();

        var repository = new FavoriRepository(context);

        var result = await repository.FindUtilisateurIdAsync(
            "unknown-user");

        Assert.IsNull(result);
    }

    [TestMethod]
    public async Task ShouldReturnOnlyCurrentUserFavorites()
    {
        await using var context = CreateContext();

        context.Favoris.AddRange(
            new FavoriEntity
            {
                UtilisateurId = 1,
                BienId = 8
            },
            new FavoriEntity
            {
                UtilisateurId = 1,
                BienId = 5
            },
            new FavoriEntity
            {
                UtilisateurId = 2,
                BienId = 10
            });

        await context.SaveChangesAsync();

        var repository = new FavoriRepository(context);

        var result = await repository.GetBienIdsAsync(1);

        CollectionAssert.AreEqual(
            new[] { 5, 8 },
            result.ToArray());
    }

    [TestMethod]
    public async Task UserWithoutFavoritesShouldReturnEmptyList()
    {
        await using var context = CreateContext();

        var repository = new FavoriRepository(context);

        var result = await repository.GetBienIdsAsync(1);

        Assert.AreEqual(0, result.Count);
    }

    [TestMethod]
    public async Task FavoriteStatusShouldBeScopedToUser()
    {
        await using var context = CreateContext();

        context.Favoris.Add(new FavoriEntity
        {
            UtilisateurId = 1,
            BienId = 5
        });

        await context.SaveChangesAsync();

        var repository = new FavoriRepository(context);

        Assert.IsTrue(await repository.ExistsAsync(1, 5));
        Assert.IsFalse(await repository.ExistsAsync(2, 5));
        Assert.IsFalse(await repository.ExistsAsync(1, 8));
    }

    [TestMethod]
    [DataRow(true, false, true)]
    [DataRow(false, false, false)]
    [DataRow(true, true, false)]
    [DataRow(false, true, false)]
    public async Task ShouldCheckPropertyPublicationStatus(
        bool isVisible,
        bool isDraft,
        bool expected)
    {
        await using var context = CreateContext();

        context.Biens.Add(new BienEntity
        {
            Id = 1,
            Titre = "Maison de test",
            EstVisible = isVisible,
            EstBrouillon = isDraft
        });

        await context.SaveChangesAsync();

        var repository = new FavoriRepository(context);

        Assert.AreEqual(
            expected,
            await repository.IsPublishedBienAsync(1));
    }

    [TestMethod]
    public async Task MissingPropertyShouldNotBePublished()
    {
        await using var context = CreateContext();

        var repository = new FavoriRepository(context);

        Assert.IsFalse(
            await repository.IsPublishedBienAsync(404));
    }

    private static ApplicationDbContext CreateContext()
    {
        var options =
            new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

        return new ApplicationDbContext(options);
    }
}