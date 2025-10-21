// Models/ForgotPasswordRequest.cs
using System.ComponentModel.DataAnnotations;

public class ForgotPasswordRequestDTO
{
    [Required, EmailAddress]
    public required string Email { get; set; }
}


