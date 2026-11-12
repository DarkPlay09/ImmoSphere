namespace ImmoSphere.Api.Dtos.auth;

public class RegisterRequestDto
{
    public string Name { get; set; } = string.Empty;
    public string GivenName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Pass { get; set; } = string.Empty;
    public string AccountType { get; set; } = string.Empty;
    public bool Conditions { get; set; }
}