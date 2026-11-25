using ImmoSphere.Domain.Core.Faq;

namespace ImmoSphere.Api.Dtos.Faq;

/// <summary>Conversions domaine → DTO.</summary>
public static class FaqDtoMapper
{
    public static FaqSearchResultDto ToDto(ResultatFaq resultat)
    {
        return new FaqSearchResultDto
        {
            TotalCount = resultat.NombreTotal,
            Categories = resultat.Categories.Select(ToDto).ToList(),
            Questions = resultat.Questions.Select(ToDto).ToList(),
        };
    }

    public static FaqCategoryDto ToDto(CategorieFaq categorie)
    {
        return new FaqCategoryDto
        {
            Code = categorie.Code,
            QuestionCount = categorie.NombreQuestions,
        };
    }

    public static FaqQuestionDto ToDto(QuestionFaq question)
    {
        return new FaqQuestionDto
        {
            Id = question.Id,
            CategoryCode = question.CodeCategorie,
            Question = question.Question,
            Answer = question.Reponse,
        };
    }
}
