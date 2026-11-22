namespace ImmoSphere.Domain.Repository;

public interface IUserRepository
{
    bool UserExists(string email);
    
    Task<string?> FindUnconfirmedUserIdAsync(string email);

    Task<string> CreateUserAsync(
        string name,
        string givenName,
        string email,
        string password,
        string accountType
    );

    Task<bool> CheckPassFor(string login, string password);
}