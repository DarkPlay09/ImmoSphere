namespace ImmoSphere.Domain.Services.Interfaces;

public interface IEmailConfirmationService
{
    Task<string> GenerateCodeAsync(string userId);

    Task<bool> VerifyCodeAsync(
        string userId,
        string code);
}