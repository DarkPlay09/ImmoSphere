namespace ImmoSphere.Domain.Services.Interfaces;

public interface IRegisterService
{
    public Task CreateUserAsync(
        string name,
        string givenName,
        string email,
        string password,
        string accountType,
        bool conditions
        );
}