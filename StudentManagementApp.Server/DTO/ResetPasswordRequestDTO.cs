// Models/ResetPasswordRequest.cs
using System.ComponentModel.DataAnnotations;

public class ResetPasswordRequestDTO
{
    [Required]
    public required string Token { get; set; }

    [RegularExpression(
         @"^(?=.{10,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).*$",
         ErrorMessage = "Password must be at least 10 characters and include uppercase, lowercase, number, and symbol."
     )]
    public required string NewPassword { get; set; }
}
