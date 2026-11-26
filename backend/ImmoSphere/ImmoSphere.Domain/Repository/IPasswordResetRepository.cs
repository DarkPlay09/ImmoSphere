namespace ImmoSphere.Domain.Repository;

public enum PasswordResetResult
{
    Success,
    InvalidCode,
    InvalidPassword
}

public interface IPasswordResetRepository
{
    Task<bool> SaveCodeAsync(string email, string code);
    Task<bool> VerifyCodeAsync(string email, string code);

    Task<PasswordResetResult> ResetPasswordAsync(
        string email,
        string code,
        string newPassword);
}