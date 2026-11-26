using ImmoSphere.Api.Dtos.Faq;
using ImmoSphere.Domain.Core.Faq;

namespace ImmoSphere.Api.Tests.Mappers;

[TestClass]
public sealed class FaqDtoMapperTest
{
    [TestMethod]
    public void ResultShouldBeMappedToApiContract()
    {
        var resultat = new ResultatFaq
        {
            NombreTotal = 3,
            Categories =
            [
                new CategorieFaq { Code = "account", NombreQuestions = 2 },
                new CategorieFaq { Code = "searchProperty", NombreQuestions = 0 },
            ],
            Questions =
            [
                new QuestionFaq { Id = 1, CodeCategorie = "account", Question = "Q1", Reponse = "R1" },
                new QuestionFaq { Id = 9, CodeCategorie = null, Question = "Q9", Reponse = "R9" },
            ],
        };

        FaqSearchResultDto dto = FaqDtoMapper.ToDto(resultat);

        Assert.AreEqual(3, dto.TotalCount);
        Assert.AreEqual(2, dto.Categories.Count);
        Assert.AreEqual("account", dto.Categories[0].Code);
        Assert.AreEqual(2, dto.Categories[0].QuestionCount);
        Assert.AreEqual(0, dto.Categories[1].QuestionCount);
        Assert.AreEqual(2, dto.Questions.Count);
        Assert.AreEqual(1, dto.Questions[0].Id);
        Assert.AreEqual("account", dto.Questions[0].CategoryCode);
        Assert.AreEqual("Q1", dto.Questions[0].Question);
        Assert.AreEqual("R1", dto.Questions[0].Answer);
        Assert.IsNull(dto.Questions[1].CategoryCode);
    }
}
