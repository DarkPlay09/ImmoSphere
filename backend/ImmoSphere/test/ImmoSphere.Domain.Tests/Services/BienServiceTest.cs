using ImmoSphere.Domain.Core.Bien;
using ImmoSphere.Domain.Repository;
using ImmoSphere.Domain.Services;

namespace ImmoSphere.Domain.Tests.Services;

[TestClass]
public sealed class BienServiceTest
{
    [TestMethod]
    public async Task GetBienByIdShouldUseUnrestrictedRepositoryMethod()
    {
        var expectedBien = new Bien { Id = 42 };
        var repository = new StubBienRepository(expectedBien);
        var service = new BienService(repository);
        using var cancellation = new CancellationTokenSource();

        Bien result = await service.GetBienByIdAsync(
            42,
            cancellation.Token);

        Assert.AreSame(expectedBien, result);
        Assert.AreEqual(1, repository.UnrestrictedCallCount);
        Assert.AreEqual(0, repository.PublishedCallCount);
        Assert.AreEqual(42, repository.ReceivedId);
        Assert.AreEqual(cancellation.Token, repository.ReceivedToken);
    }

    [TestMethod]
    public async Task GetPublishedBienByIdShouldUsePublishedRepositoryMethod()
    {
        var expectedBien = new Bien { Id = 84 };
        var repository = new StubBienRepository(expectedBien);
        var service = new BienService(repository);
        using var cancellation = new CancellationTokenSource();

        Bien result = await service.GetPublishedBienByIdAsync(
            84,
            cancellation.Token);

        Assert.AreSame(expectedBien, result);
        Assert.AreEqual(0, repository.UnrestrictedCallCount);
        Assert.AreEqual(1, repository.PublishedCallCount);
        Assert.AreEqual(84, repository.ReceivedId);
        Assert.AreEqual(cancellation.Token, repository.ReceivedToken);
    }

    private sealed class StubBienRepository : IBienRepository
    {
        private readonly Bien _bien;

        public StubBienRepository(Bien bien)
        {
            _bien = bien;
        }

        public int UnrestrictedCallCount { get; private set; }

        public int PublishedCallCount { get; private set; }

        public int ReceivedId { get; private set; }

        public CancellationToken ReceivedToken { get; private set; }

        public Task<Bien> GetBienByIdAsync(
            int id,
            CancellationToken cancellationToken)
        {
            UnrestrictedCallCount++;
            ReceivedId = id;
            ReceivedToken = cancellationToken;
            return Task.FromResult(_bien);
        }

        public Task<Bien> GetPublishedBienByIdAsync(
            int id,
            CancellationToken cancellationToken)
        {
            PublishedCallCount++;
            ReceivedId = id;
            ReceivedToken = cancellationToken;
            return Task.FromResult(_bien);
        }
    }
}
