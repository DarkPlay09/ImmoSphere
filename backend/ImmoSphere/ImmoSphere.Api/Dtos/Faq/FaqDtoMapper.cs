using ImmoSphere.Domain.Core.Faq;

namespace ImmoSphere.Api.Dtos.Faq;

/// <summary>Conversions domaine → DTO.</summary>
public static class FaqDtoMapper
{
    public static FaqQuestionDto ToDto(QuestionFaq question)
    {
        return new FaqQuestionDto
        {
            Id = question.Id,
            Question = question.Question,
            Answer = question.Reponse,
        };
    }
}
