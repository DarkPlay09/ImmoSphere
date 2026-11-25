using ImmoSphere.Api.Controllers;
using ImmoSphere.Api.Dtos.Faq;
using ImmoSphere.Api.Errors;
using ImmoSphere.Domain.Core.Faq;
using ImmoSphere.Domain.Exceptions;
using ImmoSphere.Domain.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Abstractions;

namespace ImmoSphere.Api.Tests.Controllers;

[TestClass]
public sealed class FaqControllerTest
{
    [TestMethod]
    public async Task SearchShouldReturnOkWithMappedResult()
    {
        var service = new StubFaqService(new ResultatFaq
        {
            NombreTotal = 1,
            Categories = [new CategorieFaq { Code = "account", NombreQuestions = 1 }],
            Questions = [new QuestionFaq { Id = 1, CodeCategorie = "account", Question = "Q", Reponse = "R" }],
        });
        var controller = CreateController(service);
        using var cancellation = new CancellationTokenSource();

        ActionResult<FaqSearchResultDto> action =
            await controller.Search("compte", "account", cancellation.Token);

        var ok = action.Result as OkObjectResult;
        Assert.IsNotNull(ok);
        var dto = ok.Value as FaqSearchResultDto;
        Assert.IsNotNull(dto);
        Assert.AreEqual(1, dto.TotalCount);
        Assert.AreEqual("account", dto.Questions[0].CategoryCode);
        Assert.AreEqual("compte", service.ReceivedSearch);
        Assert.AreEqual("account", service.ReceivedCategory);
        Assert.AreEqual(cancellation.Token, service.ReceivedToken);
    }

    [TestMethod]
    public async Task TooLongSearchShouldReturnBadRequestWithStableCode()
    {
        var controller = CreateController(new StubFaqService(new RechercheTropLongueException(100)));

        ActionResult<FaqSearchResultDto> action =
            await controller.Search(new string('a', 101), null, CancellationToken.None);

        AssertBadRequest(action, ApiErrorCodes.SearchTooLong);
    }

    [TestMethod]
    public async Task UnknownCategoryShouldReturnBadRequestWithStableCode()
    {
        var controller = CreateController(new StubFaqService(new CategorieFaqInconnueException("inconnue")));

        ActionResult<FaqSearchResultDto> action =
            await controller.Search(null, "inconnue", CancellationToken.None);

        AssertBadRequest(action, ApiErrorCodes.FaqCategoryUnknown);
    }

    private static FaqController CreateController(IFaqService service) =>
        new(service, NullLogger<FaqController>.Instance);

    private static void AssertBadRequest(ActionResult<FaqSearchResultDto> action, string expectedCode)
    {
        var badRequest = action.Result as BadRequestObjectResult;
        Assert.IsNotNull(badRequest);
        var error = badRequest.Value as ApiError;
        Assert.IsNotNull(error);
        Assert.AreEqual(expectedCode, error.Code);
    }

    private sealed class StubFaqService : IFaqService
    {
        private readonly ResultatFaq? _result;
        private readonly Exception? _exception;

        public StubFaqService(ResultatFaq result)
        {
            _result = result;
        }

        public StubFaqService(Exception exception)
        {
            _exception = exception;
        }

        public string? ReceivedSearch { get; private set; }

        public string? ReceivedCategory { get; private set; }

        public CancellationToken ReceivedToken { get; private set; }

        public Task<ResultatFaq> SearchAsync(
            string? recherche,
            string? codeCategorie,
            CancellationToken cancellationToken)
        {
            ReceivedSearch = recherche;
            ReceivedCategory = codeCategorie;
            ReceivedToken = cancellationToken;
            return _exception is null ? Task.FromResult(_result!) : Task.FromException<ResultatFaq>(_exception);
        }
    }
}
