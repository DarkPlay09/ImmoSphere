using ImmoSphere.Domain.Core.Faq;
using ImmoSphere.Infrastructure.Mappers;
using ImmoSphere.Infrastructure.Persistence.Entities;

namespace ImmoSphere.Infrastructure.Tests.Mappers;

[TestClass]
public sealed class FaqMapperTest
{
    [TestMethod]
    public void EntityWithCategoryShouldBeMappedToDomainQuestion()
    {
        var entity = new FaqEntity
        {
            Id = 6,
            Titre = "Comment fonctionne une visite virtuelle 360° ?",
            Libelle = "Explorez les vues panoramiques.",
            CategorieFaqId = 3,
            CategorieFaq = new CategorieFaqEntity { Id = 3, Code = "visitsAppointments", Ordre = 3 },
        };

        QuestionFaq question = FaqMapper.FaqToDomain(entity);

        Assert.AreEqual(6, question.Id);
        Assert.AreEqual("visitsAppointments", question.CodeCategorie);
        Assert.AreEqual("Comment fonctionne une visite virtuelle 360° ?", question.Question);
        Assert.AreEqual("Explorez les vues panoramiques.", question.Reponse);
    }

    [TestMethod]
    public void EntityWithoutCategoryOrAnswerShouldUseSafeDefaults()
    {
        var entity = new FaqEntity { Id = 1, Titre = "Question", Libelle = null };

        QuestionFaq question = FaqMapper.FaqToDomain(entity);

        Assert.IsNull(question.CodeCategorie);
        Assert.AreEqual(string.Empty, question.Reponse);
    }

    [TestMethod]
    public void CategoryEntityShouldBeMappedWithItsQuestionCount()
    {
        var entity = new CategorieFaqEntity { Id = 5, Code = "notariesReviews", Ordre = 5 };

        CategorieFaq categorie = FaqMapper.CategorieToDomain(entity, 3);

        Assert.AreEqual("notariesReviews", categorie.Code);
        Assert.AreEqual(3, categorie.NombreQuestions);
    }
}
