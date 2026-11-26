namespace ImmoSphere.Api.Dtos.Faq;

/// <summary>Catégorie de la FAQ ; le front traduit <see cref="Code"/> (<c>faq.categories.&lt;code&gt;</c>).</summary>
public class FaqCategoryDto
{
    public string Code { get; init; } = string.Empty;
    public int QuestionCount { get; init; }
}
