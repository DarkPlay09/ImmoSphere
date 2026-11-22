using ImmoSphere.Domain.Core.Faq;
using ImmoSphere.Domain.Repository;
using ImmoSphere.Domain.Services.Interfaces;

namespace ImmoSphere.Domain.Services;

public class FaqService : IFaqService
{
    private readonly IFaqRepository _repository;

    public FaqService(IFaqRepository repository)
    {
        _repository = repository;
    }

    public Task<IList<QuestionFaq>> SearchAsync(string? recherche, CancellationToken cancellationToken = default)
    {
        // Une recherche vide ou faite d'espaces affiche toute la FAQ.
        string? terme = string.IsNullOrWhiteSpace(recherche) ? null : recherche.Trim();
        return _repository.SearchAsync(terme, cancellationToken);
    }
}
