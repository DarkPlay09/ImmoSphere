namespace ImmoSphere.Api.Dtos.auth;

public class VerifyResetCodeRequestDto
{
    public string Email { get; set; }
    public string Code { get; set; }
}