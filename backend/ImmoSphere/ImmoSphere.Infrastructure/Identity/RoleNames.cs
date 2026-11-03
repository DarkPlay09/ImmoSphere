namespace ImmoSphere.Infrastructure.Identity;

public static class RoleNames
{
    public const string Administrateur = "Administrateur";
    public const string ProprietaireParticulier = "Propriétaire particulier";
    public const string AgentImmobilier = "Agent immobilier";
    public const string AgentGestionnaire = "Agent gestionnaire";
    public const string Notaire = "Notaire";
    public const string Client = "Client";

    public static readonly string[] Tous =
    [
        Administrateur,
        ProprietaireParticulier,
        AgentImmobilier,
        AgentGestionnaire,
        Notaire,
        Client
    ];
}
