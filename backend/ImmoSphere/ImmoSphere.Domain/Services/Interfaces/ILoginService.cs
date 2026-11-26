using ImmoSphere.Domain.Repository;

namespace ImmoSphere.Domain.Services.Interfaces;

public interface ILoginService
{
    public Task<string?> Login(string login, string password, bool remember);
    Task<bool> SendVerificationEmail(string email);

    Task<bool> VerifyPasswordResetCodeAsync(
        string email, string code);

    Task<PasswordResetResult> ResetPasswordAsync(
        string email, string code, string newPassword);}