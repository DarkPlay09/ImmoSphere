namespace ImmoSphere.Infrastructure.Persistence.Entities;

public class EmailConfirmationCodeEntity
{
    public int Id { get; set; }

    // Identifiant de l'utilisateur Identity
    public string UserId { get; set; } = string.Empty;

    // Empreinte sécurisée du code
    public string CodeHash { get; set; } = string.Empty;

    // Date de création
    public DateTime CreatedAtUtc { get; set; }

    // Date d'expiration
    public DateTime ExpiresAtUtc { get; set; }

    // Nombre de tentatives échouées
    public int Attempts { get; set; } = 0;

    // Indique si le code a déjà été utilisé
    public bool IsUsed { get; set; } = false;
}