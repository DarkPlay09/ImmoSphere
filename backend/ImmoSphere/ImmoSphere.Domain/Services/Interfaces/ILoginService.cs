namespace ImmoSphere.Domain.Services.Interfaces;

public interface ILoginService
{
    public Task<string?> Login(string login, string password, bool remember);
}