using System.ComponentModel.DataAnnotations;

namespace ImmoSphere.Api.Dtos.auth;

public sealed class ResendConfirmationRequestDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}