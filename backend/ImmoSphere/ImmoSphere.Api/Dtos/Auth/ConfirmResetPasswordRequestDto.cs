namespace ImmoSphere.Api.Dtos.auth;

public class ConfirmResetPasswordRequestDto
{
    public string Email { get; set; }
    public string Code { get; set; }
    public string NewPassword { get; set; }
}