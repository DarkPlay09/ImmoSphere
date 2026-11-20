using ImmoSphere.Api.Controllers;
using ImmoSphere.Api.Dtos.Biens;
using ImmoSphere.Domain.Core.Bien;
using ImmoSphere.Domain.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ImmoSphere.Api.Tests.Controllers;

[TestClass]
public sealed class BienControllerTest
{
    [TestMethod]
    public async Task PublishedBienShouldReturnOkWithMappedDetail()
    {
        var expectedBien = BienForResponse();
        var service = new StubBienService(expectedBien);
        var controller = new BienController(service);
        using var cancellation = new CancellationTokenSource();

        ActionResult<BienDetailResponseDto> action =
            await controller.GetPublishedBienByIdAsync(
                42,
                cancellation.Token);

        var ok = action.Result as OkObjectResult;
        Assert.IsNotNull(ok);
        var response = ok.Value as BienDetailResponseDto;
        Assert.IsNotNull(response);
        Assert.AreEqual(42, response.Id);
        Assert.AreEqual("Maison familiale", response.Titre);
        Assert.AreEqual(1, service.PublishedCallCount);
        Assert.AreEqual(0, service.UnrestrictedCallCount);
        Assert.AreEqual(42, service.ReceivedId);
        Assert.AreEqual(cancellation.Token, service.ReceivedToken);
    }

    [TestMethod]
    public async Task MissingPublishedBienShouldReturnNotFound()
    {
        const string message = "Le bien avec l'ID 404 n'existe pas.";
        var service = new StubBienService(
            new KeyNotFoundException(message));
        var controller = new BienController(service);

        ActionResult<BienDetailResponseDto> action =
            await controller.GetPublishedBienByIdAsync(
                404,
                CancellationToken.None);

        var notFound = action.Result as NotFoundObjectResult;
        Assert.IsNotNull(notFound);
        Assert.IsNotNull(notFound.Value);
        object? returnedMessage = notFound.Value.GetType()
            .GetProperty("message")?
            .GetValue(notFound.Value);
        Assert.AreEqual(message, returnedMessage);
        Assert.AreEqual(1, service.PublishedCallCount);
        Assert.AreEqual(0, service.UnrestrictedCallCount);
    }

    private static Bien BienForResponse()
    {
        return new Bien
        {
            Id = 42,
            Titre = "Maison familiale",
            Rue = "Rue Saint-Gilles",
            CodePostal = 4000,
            Localite = "Liège",
            Province = "Liège",
            InformationAnnexes = []
        };
    }

    private sealed class StubBienService : IBienService
    {
        private readonly Bien? _bien;
        private readonly Exception? _publishedException;

        public StubBienService(Bien bien)
        {
            _bien = bien;
        }

        public StubBienService(Exception publishedException)
        {
            _publishedException = publishedException;
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
            return Task.FromResult(_bien!);
        }

        public Task<Bien> GetPublishedBienByIdAsync(
            int id,
            CancellationToken cancellationToken)
        {
            PublishedCallCount++;
            ReceivedId = id;
            ReceivedToken = cancellationToken;

            if (_publishedException is not null)
            {
                return Task.FromException<Bien>(_publishedException);
            }

            return Task.FromResult(_bien!);
        }
    }
}
