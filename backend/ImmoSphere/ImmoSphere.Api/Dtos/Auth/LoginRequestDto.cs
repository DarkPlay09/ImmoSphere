namespace ImmoSphere.Api.Dtos.auth;

public class LoginRequestDto
{
    public string Email { get; set; }
    public string Password { get; set; }
    public bool RememberMe { get; set; }
}