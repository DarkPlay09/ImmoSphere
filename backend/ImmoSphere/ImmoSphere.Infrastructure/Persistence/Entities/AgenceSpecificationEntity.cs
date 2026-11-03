namespace ImmoSphere.Infrastructure.Persistence.Entities;

// Table de jonction explicite (association N-N supposée : à vérifier dans le MLD).
public class AgenceSpecificationEntity
{
    public int AgenceId { get; set; }
    public AgenceEntity Agence { get; set; } = null!;

    public int SpecificationId { get; set; }
    public SpecificationEntity Specification { get; set; } = null!;
}
