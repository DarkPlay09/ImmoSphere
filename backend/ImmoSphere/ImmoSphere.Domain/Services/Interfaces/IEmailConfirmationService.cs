namespace ImmoSphere.Domain.Services.Interfaces;

public interface IEmailConfirmationService
{
    Task<string> GenerateConfirmationLinkAsync(string email);

    Task<bool> ConfirmEmailAsync(string userId, string token);
}