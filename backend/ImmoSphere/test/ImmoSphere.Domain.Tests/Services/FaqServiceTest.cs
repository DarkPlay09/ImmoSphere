using ImmoSphere.Domain.Core.Faq;
using ImmoSphere.Domain.Exceptions;
using ImmoSphere.Domain.Repository;
using ImmoSphere.Domain.Services;

namespace ImmoSphere.Domain.Tests.Services;

[TestClass]
public sealed class FaqServiceTest
{
    [TestMethod]
    public async Task SearchShouldReturnRepositoryResultWithTrimmedCriteria()
    {
        var expected = ResultWithCategories("account", "searchProperty");
        var repository = new StubFaqRepository(expected);
        var service = new FaqService(repository);
        using var cancellation = new CancellationTokenSource();

        ResultatFaq result = await service.SearchAsync(
            "  visite 360° ",
            " account ",
            cancellation.Token);

        Assert.AreSame(expected, result);
        Assert.AreEqual(1, repository.CallCount);
        Assert.AreEqual("visite 360°", repository.ReceivedSearch);
        Assert.AreEqual("account", repository.ReceivedCategory);
        Assert.AreEqual(cancellation.Token, repository.ReceivedToken);
    }

    [TestMethod]
    public async Task BlankCriteriaShouldBeSentAsNull()
    {
        var repository = new StubFaqRepository(ResultWithCategories("account"));
        var service = new FaqService(repository);

        await service.SearchAsync("   ", "", CancellationToken.None);

        Assert.IsNull(repository.ReceivedSearch);
        Assert.IsNull(repository.ReceivedCategory);
    }

    [TestMethod]
    public async Task TooLongSearchShouldThrowWithoutQueryingRepository()
    {
        var repository = new StubFaqRepository(ResultWithCategories("account"));
        var service = new FaqService(repository);
        string search = new('a', QuestionFaq.LongueurMaxRecherche + 1);

        var exception = await Assert.ThrowsExactlyAsync<RechercheTropLongueException>(
            () => service.SearchAsync(search, null, CancellationToken.None));

        Assert.AreEqual(QuestionFaq.LongueurMaxRecherche, exception.LongueurMax);
        Assert.AreEqual(0, repository.CallCount);
    }

    [TestMethod]
    public async Task SearchAtMaximumLengthShouldBeAccepted()
    {
        var repository = new StubFaqRepository(ResultWithCategories("account"));
        var service = new FaqService(repository);
        string search = $"  {new string('a', QuestionFaq.LongueurMaxRecherche)}  ";

        await service.SearchAsync(search, null, CancellationToken.None);

        Assert.AreEqual(1, repository.CallCount);
    }

    [TestMethod]
    public async Task UnknownCategoryShouldThrow()
    {
        var repository = new StubFaqRepository(ResultWithCategories("account", "searchProperty"));
        var service = new FaqService(repository);

        var exception = await Assert.ThrowsExactlyAsync<CategorieFaqInconnueException>(
            () => service.SearchAsync(null, "inconnue", CancellationToken.None));

        Assert.AreEqual("inconnue", exception.Code);
    }

    [TestMethod]
    public async Task CategoryCodeShouldBeCaseSensitive()
    {
        var repository = new StubFaqRepository(ResultWithCategories("account"));
        var service = new FaqService(repository);

        await Assert.ThrowsExactlyAsync<CategorieFaqInconnueException>(
            () => service.SearchAsync(null, "Account", CancellationToken.None));
    }

    private static ResultatFaq ResultWithCategories(params string[] codes)
    {
        return new ResultatFaq
        {
            NombreTotal = codes.Length,
            Categories = codes.Select(code => new CategorieFaq { Code = code, NombreQuestions = 1 }).ToList(),
        };
    }

    private sealed class StubFaqRepository : IFaqRepository
    {
        private readonly ResultatFaq _result;

        public StubFaqRepository(ResultatFaq result)
        {
            _result = result;
        }

        public int CallCount { get; private set; }

        public string? ReceivedSearch { get; private set; }

        public string? ReceivedCategory { get; private set; }

        public CancellationToken ReceivedToken { get; private set; }

        public Task<ResultatFaq> SearchAsync(
            string? recherche,
            string? codeCategorie,
            CancellationToken cancellationToken)
        {
            CallCount++;
            ReceivedSearch = recherche;
            ReceivedCategory = codeCategorie;
            ReceivedToken = cancellationToken;
            return Task.FromResult(_result);
        }
    }
}
