using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;

using ImmoSphere.Api.Controllers;
using ImmoSphere.Domain.Services.Interfaces;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ImmoSphere.Api.Tests.Controllers;

[TestClass]
public sealed class FavorisControllerTest
{
    private StubFavoriService _service = null!;
    private FavorisController _controller = null!;

    [TestInitialize]
    public void Initialize()
    {
        _service = new StubFavoriService();
        _controller = CreateController(_service, "user-1");
    }

    [TestMethod]
    public async Task GetFavoritesShouldReturnOk()
    {
        var result = await _controller.GetFavoris(
            CancellationToken.None);

        var ok = result as OkObjectResult;

        Assert.IsNotNull(ok);

        CollectionAssert.AreEqual(
            new[] { 5, 8 },
            ((IReadOnlyList<int>)ok.Value!).ToArray());

        Assert.AreEqual("user-1", _service.ReceivedUserId);
    }

    [TestMethod]
    public async Task GetFavoriteShouldReturnStatus()
    {
        var result = await _controller.GetFavori(
            5,
            CancellationToken.None);

        var ok = result as OkObjectResult;

        Assert.IsNotNull(ok);

        var json = JsonSerializer.SerializeToElement(ok.Value);

        Assert.AreEqual(5, json.GetProperty("bienId").GetInt32());
        Assert.IsTrue(json.GetProperty("isFavorite").GetBoolean());

        Assert.AreEqual(5, _service.ReceivedBienId);
    }

    [TestMethod]
    public async Task AddShouldReturnNoContent()
    {
        var result = await _controller.AddFavori(
            5,
            CancellationToken.None);

        Assert.IsInstanceOfType<NoContentResult>(result);
        Assert.AreEqual("user-1", _service.ReceivedUserId);
        Assert.AreEqual(5, _service.ReceivedBienId);
        Assert.AreEqual("add", _service.ReceivedAction);
    }

    [TestMethod]
    public async Task RemoveShouldReturnNoContent()
    {
        var result = await _controller.RemoveFavori(
            5,
            CancellationToken.None);

        Assert.IsInstanceOfType<NoContentResult>(result);
        Assert.AreEqual("remove", _service.ReceivedAction);
        Assert.AreEqual(5, _service.ReceivedBienId);
    }

    [TestMethod]
    public async Task MissingIdentityShouldReturnUnauthorized()
    {
        var controller = CreateController(_service, null);

        var result = await controller.GetFavoris(
            CancellationToken.None);

        Assert.IsInstanceOfType<UnauthorizedObjectResult>(result);
        Assert.IsNull(_service.ReceivedUserId);
    }

    [TestMethod]
    public async Task MissingProfileShouldReturnForbidden()
    {
        _service.Exception = new UnauthorizedAccessException();

        var result = await _controller.GetFavoris(
            CancellationToken.None);

        var forbidden = result as ObjectResult;

        Assert.IsNotNull(forbidden);
        Assert.AreEqual(403, forbidden.StatusCode);
    }

    [TestMethod]
    public async Task InvalidPropertyIdShouldReturnBadRequest()
    {
        _service.Exception =
            new ArgumentOutOfRangeException("bienId");

        var result = await _controller.AddFavori(
            -1,
            CancellationToken.None);

        Assert.IsInstanceOfType<BadRequestObjectResult>(result);
    }

    [TestMethod]
    public async Task MissingPropertyShouldReturnNotFound()
    {
        _service.Exception = new KeyNotFoundException();

        var result = await _controller.AddFavori(
            404,
            CancellationToken.None);

        Assert.IsInstanceOfType<NotFoundObjectResult>(result);
    }

    [TestMethod]
    public async Task ShouldTransmitCancellationToken()
    {
        using var cancellation = new CancellationTokenSource();

        await _controller.AddFavori(
            5,
            cancellation.Token);

        Assert.AreEqual(
            cancellation.Token,
            _service.ReceivedToken);
    }

    private static FavorisController CreateController(
        IFavoriService service,
        string? userId)
    {
        var identity = userId is null
            ? new ClaimsIdentity()
            : new ClaimsIdentity(
                [
                    new Claim(
                        JwtRegisteredClaimNames.Sub,
                        userId)
                ],
                "Bearer");

        return new FavorisController(service)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(identity)
                }
            }
        };
    }

    private sealed class StubFavoriService : IFavoriService
    {
        public Exception? Exception { get; set; }

        public string? ReceivedUserId { get; private set; }

        public int? ReceivedBienId { get; private set; }

        public string? ReceivedAction { get; private set; }

        public CancellationToken ReceivedToken { get; private set; }

        public Task<IReadOnlyList<int>> GetBienIdsAsync(
            string identityUserId,
            CancellationToken cancellationToken = default)
        {
            Record(identityUserId, null, "list", cancellationToken);

            return Exception is null
                ? Task.FromResult<IReadOnlyList<int>>([5, 8])
                : Task.FromException<IReadOnlyList<int>>(Exception);
        }

        public Task<bool> IsFavoriteAsync(
            string identityUserId,
            int bienId,
            CancellationToken cancellationToken = default)
        {
            Record(identityUserId, bienId, "status", cancellationToken);

            return Exception is null
                ? Task.FromResult(true)
                : Task.FromException<bool>(Exception);
        }

        public Task AddAsync(
            string identityUserId,
            int bienId,
            CancellationToken cancellationToken = default)
        {
            Record(identityUserId, bienId, "add", cancellationToken);

            return Exception is null
                ? Task.CompletedTask
                : Task.FromException(Exception);
        }

        public Task RemoveAsync(
            string identityUserId,
            int bienId,
            CancellationToken cancellationToken = default)
        {
            Record(identityUserId, bienId, "remove", cancellationToken);

            return Exception is null
                ? Task.CompletedTask
                : Task.FromException(Exception);
        }

        private void Record(
            string userId,
            int? bienId,
            string action,
            CancellationToken cancellationToken)
        {
            ReceivedUserId = userId;
            ReceivedBienId = bienId;
            ReceivedAction = action;
            ReceivedToken = cancellationToken;
        }
    }
}