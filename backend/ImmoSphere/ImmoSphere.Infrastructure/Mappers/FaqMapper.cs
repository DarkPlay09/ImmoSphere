using ImmoSphere.Domain.Core.Faq;
using ImmoSphere.Infrastructure.Persistence.Entities;

namespace ImmoSphere.Infrastructure.Mappers;

/// <summary>Entité <c>faq</c> → question du domaine : <c>titre</c> = question, <c>libelle</c> = réponse.</summary>
internal static class FaqMapper
{
    public static QuestionFaq FaqToDomain(FaqEntity entity)
    {
        return new QuestionFaq
        {
            Id = entity.Id,
            Question = entity.Titre,
            Reponse = entity.Libelle ?? string.Empty,
        };
    }
}
