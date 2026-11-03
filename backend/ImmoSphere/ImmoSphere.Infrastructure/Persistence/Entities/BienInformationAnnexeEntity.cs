namespace ImmoSphere.Infrastructure.Persistence.Entities;

// Table de jonction explicite (association N-N supposée : à vérifier dans le MLD).
public class BienInformationAnnexeEntity
{
    public int BienId { get; set; }
    public BienEntity Bien { get; set; } = null!;

    public int InformationAnnexeId { get; set; }
    public InformationAnnexeEntity InformationAnnexe { get; set; } = null!;
}
