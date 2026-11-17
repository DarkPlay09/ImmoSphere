namespace ImmoSphere.Domain.Services.Interfaces;

public interface ITokenService
{
    Task<string> GenerateTokenAsync(string email);
}