namespace ImmoSphere.Infrastructure.Persistence.Entities;

/// <summary>
/// Catégorie de la FAQ (UC7). Seul le code est stocké : le libellé est traduit par le front
/// (clé <c>faq.categories.&lt;code&gt;</c>).
/// </summary>
public class CategorieFaqEntity
{
    public int Id { get; set; }

    /// <summary>Identifiant stable en lowerCamelCase, unique, utilisé comme clé de traduction.</summary>
    public string Code { get; set; } = string.Empty;

    /// <summary>Position de la catégorie dans la navigation et dans la liste des questions.</summary>
    public int Ordre { get; set; }

    public ICollection<FaqEntity> Faqs { get; set; } = new List<FaqEntity>();
}
