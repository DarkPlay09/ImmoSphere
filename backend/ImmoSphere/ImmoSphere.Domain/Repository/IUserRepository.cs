namespace ImmoSphere.Domain.Repository;

public interface IUserRepository
{
    bool UserExists(string email);

    Task CreateUserAsync(
        string name,
        string givenName,
        string email,
        string password,
        string accountType
    );
}