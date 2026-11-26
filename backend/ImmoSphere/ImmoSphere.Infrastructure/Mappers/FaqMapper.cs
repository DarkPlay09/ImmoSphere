using ImmoSphere.Domain.Core.Faq;
using ImmoSphere.Infrastructure.Persistence.Entities;

namespace ImmoSphere.Infrastructure.Mappers;

/// <summary>Entités de la FAQ → domaine : <c>titre</c> = question, <c>libelle</c> = réponse.</summary>
public static class FaqMapper
{
    /// <remarks>La catégorie doit avoir été chargée (<c>Include</c>) pour que son code soit renseigné.</remarks>
    public static QuestionFaq FaqToDomain(FaqEntity entity)
    {
        return new QuestionFaq
        {
            Id = entity.Id,
            CodeCategorie = entity.CategorieFaq?.Code,
            Question = entity.Titre,
            Reponse = entity.Libelle ?? string.Empty,
        };
    }

    public static CategorieFaq CategorieToDomain(CategorieFaqEntity entity, int nombreQuestions)
    {
        return new CategorieFaq
        {
            Code = entity.Code,
            NombreQuestions = nombreQuestions,
        };
    }
}
