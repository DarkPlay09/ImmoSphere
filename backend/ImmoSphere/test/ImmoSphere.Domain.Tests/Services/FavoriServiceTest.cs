using ImmoSphere.Domain.Repository;
using ImmoSphere.Domain.Services;

namespace ImmoSphere.Domain.Tests.Services;

[TestClass]
public sealed class FavoriServiceTest
{
    private StubFavoriRepository _repository = null!;
    private FavoriService _service = null!;

    [TestInitialize]
    public void Initialize()
    {
        _repository = new StubFavoriRepository();
        _service = new FavoriService(_repository);
    }

    [TestMethod]
    public async Task GetFavoritesShouldReturnUserFavorites()
    {
        _repository.Favorites.Add((1, 5));
        _repository.Favorites.Add((1, 8));
        _repository.Favorites.Add((2, 10));

        var result = await _service.GetBienIdsAsync("user-1");

        CollectionAssert.AreEqual(
            new[] { 5, 8 },
            result.ToArray());
    }

    [TestMethod]
    public async Task AddShouldSavePublishedProperty()
    {
        await _service.AddAsync("user-1", 5);

        Assert.IsTrue(_repository.Favorites.Contains((1, 5)));
    }

    [TestMethod]
    public async Task AddShouldNotCreateDuplicate()
    {
        await _service.AddAsync("user-1", 5);
        await _service.AddAsync("user-1", 5);

        Assert.AreEqual(1, _repository.Favorites.Count);
    }

    [TestMethod]
    public async Task UnpublishedPropertyShouldBeRejected()
    {
        _repository.IsPublished = false;

        await Assert.ThrowsExactlyAsync<KeyNotFoundException>(
            () => _service.AddAsync("user-1", 5));

        Assert.AreEqual(0, _repository.Favorites.Count);
    }

    [TestMethod]
    public async Task RemoveShouldDeleteFavorite()
    {
        _repository.Favorites.Add((1, 5));

        await _service.RemoveAsync("user-1", 5);

        Assert.IsFalse(_repository.Favorites.Contains((1, 5)));
    }

    [TestMethod]
    public async Task RemoveShouldAcceptMissingFavorite()
    {
        await _service.RemoveAsync("user-1", 5);

        Assert.AreEqual(0, _repository.Favorites.Count);
    }

    [TestMethod]
    public async Task RemoveShouldAcceptUnpublishedProperty()
    {
        _repository.Favorites.Add((1, 5));
        _repository.IsPublished = false;

        await _service.RemoveAsync("user-1", 5);

        Assert.IsFalse(_repository.Favorites.Contains((1, 5)));
    }

    [TestMethod]
    public async Task IsFavoriteShouldReturnCorrectStatus()
    {
        _repository.Favorites.Add((1, 5));

        Assert.IsTrue(
            await _service.IsFavoriteAsync("user-1", 5));

        Assert.IsFalse(
            await _service.IsFavoriteAsync("user-1", 8));
    }

    [TestMethod]
    public async Task UsersShouldHaveIndependentFavorites()
    {
        await _service.AddAsync("user-1", 5);
        await _service.AddAsync("user-2", 5);

        await _service.RemoveAsync("user-1", 5);

        Assert.IsFalse(
            await _service.IsFavoriteAsync("user-1", 5));

        Assert.IsTrue(
            await _service.IsFavoriteAsync("user-2", 5));
    }

    [TestMethod]
    [DataRow("")]
    [DataRow(" ")]
    [DataRow("unknown-user")]
    public async Task UnknownUserShouldBeRejected(string userId)
    {
        await Assert.ThrowsExactlyAsync<UnauthorizedAccessException>(
            () => _service.GetBienIdsAsync(userId));
    }

    [TestMethod]
    [DataRow(0)]
    [DataRow(-1)]
    public async Task InvalidPropertyIdShouldBeRejected(int bienId)
    {
        await Assert.ThrowsExactlyAsync<ArgumentOutOfRangeException>(
            () => _service.AddAsync("user-1", bienId));

        await Assert.ThrowsExactlyAsync<ArgumentOutOfRangeException>(
            () => _service.RemoveAsync("user-1", bienId));

        await Assert.ThrowsExactlyAsync<ArgumentOutOfRangeException>(
            () => _service.IsFavoriteAsync("user-1", bienId));

        Assert.AreEqual(0, _repository.Favorites.Count);
    }

    private sealed class StubFavoriRepository : IFavoriRepository
    {
        public HashSet<(int UtilisateurId, int BienId)> Favorites
            { get; } = [];

        public bool IsPublished { get; set; } = true;

        public Task<int?> FindUtilisateurIdAsync(
            string identityUserId,
            CancellationToken cancellationToken = default)
        {
            int? id = identityUserId switch
            {
                "user-1" => 1,
                "user-2" => 2,
                _ => null
            };

            return Task.FromResult(id);
        }

        public Task<IReadOnlyList<int>> GetBienIdsAsync(
            int utilisateurId,
            CancellationToken cancellationToken = default)
        {
            IReadOnlyList<int> ids = Favorites
                .Where(f => f.UtilisateurId == utilisateurId)
                .Select(f => f.BienId)
                .OrderBy(id => id)
                .ToList();

            return Task.FromResult(ids);
        }

        public Task<bool> IsPublishedBienAsync(
            int bienId,
            CancellationToken cancellationToken = default)
        {
            return Task.FromResult(IsPublished);
        }

        public Task<bool> ExistsAsync(
            int utilisateurId,
            int bienId,
            CancellationToken cancellationToken = default)
        {
            return Task.FromResult(
                Favorites.Contains((utilisateurId, bienId)));
        }

        public Task AddAsync(
            int utilisateurId,
            int bienId,
            CancellationToken cancellationToken = default)
        {
            Favorites.Add((utilisateurId, bienId));

            return Task.CompletedTask;
        }

        public Task RemoveAsync(
            int utilisateurId,
            int bienId,
            CancellationToken cancellationToken = default)
        {
            Favorites.Remove((utilisateurId, bienId));

            return Task.CompletedTask;
        }
    }
}