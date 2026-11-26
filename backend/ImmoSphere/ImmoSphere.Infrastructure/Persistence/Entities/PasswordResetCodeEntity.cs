namespace ImmoSphere.Infrastructure.Persistence.Entities;

public class PasswordResetCodeEntity
{
    public string UserId { get; set; } = string.Empty;
    public string CodeHash { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    public DateTime ExpiresAtUtc { get; set; }
    public int Attempts { get; set; }
    public bool IsUsed { get; set; }
}