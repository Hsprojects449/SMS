using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolApp.Models;
// using SchoolApp.Data;
using SchoolApp.Services;

namespace SchoolApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly SchoolContext _context;
        private readonly JwtService _jwt;
        private readonly IEmailService _emails;
        private readonly IConfiguration _config;

        public AuthController(
        SchoolContext context,JwtService jwt,IEmailService emails,IConfiguration config)
        {
            _context = context;
            _jwt = jwt;
            _emails = emails;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // search by either email OR UserID
            var user = await _context.Users
                .Include(u => u.Student)
                .Include(u => u.Teacher)
                .FirstOrDefaultAsync(u =>
                    (u.ContactEmail == request.Identifier
                  || u.UserID == request.Identifier)
                 && u.PasswordHash == request.Password);

            if (user == null)
                return Unauthorized("Invalid credentials.");

            var token = _jwt.GenerateToken(user);

            return Ok(new
            {
                token,
                role = user.Role,
                userId = user.UserID,
                Name = user.Name
            });
        }

        [HttpPost("forgot-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDTO req)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ContactEmail == req.Email);
            if (user == null) 
                return Ok(); // don't reveal email existence
            //[26th]
            if (user.Role != "Teacher")
                return BadRequest("Only teachers are allowed to reset their password.");
            // generate & store token
            user.ResetPasswordToken = Guid.NewGuid().ToString("N");
            user.ResetPasswordTokenExpiry = DateTime.UtcNow.AddHours(1);
            await _context.SaveChangesAsync();

            // build reset link
            var resetUrl = $"{_config["FrontendUrl"]}/reset-password?token={user.ResetPasswordToken}";
            var html = $@"
                <!DOCTYPE html>
                <html>
                <head>
                <meta charset='UTF-8'>
                <style>
                    body {{
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f7;
                    margin: 0;
                    padding: 0;
                    }}
                    .container {{
                    max-width: 600px;
                    margin: 30px auto;
                    background: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    padding: 30px;
                    }}
                    h2 {{
                    color: #333333;
                    text-align: center;
                    }}
                    p {{
                    color: #555555;
                    font-size: 15px;
                    line-height: 1.5;
                    }}
                    .btn {{
                    display: inline-block;
                    background-color: #4CAF50;
                    color: white !important;
                    padding: 12px 24px;
                    border-radius: 6px;
                    text-decoration: none;
                    font-weight: bold;
                    margin-top: 20px;
                    }}
                    .footer {{
                    text-align: center;
                    font-size: 12px;
                    color: #999999;
                    margin-top: 30px;
                    }}
                </style>
                </head>
                <body>
                <div class='container'>
                    <h2>Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>We received a request to reset your password for the <strong>School Management System</strong>.</p>
                    <p>Please click the button below to reset your password. This link is valid for <strong>1 hour</strong>:</p>
                    <p style='text-align: center;'>
                    <a href='{resetUrl}' class='btn'>Reset Password</a>
                    </p>
                    <p>If you did not request a password reset, please ignore this email. Your account will remain secure.</p>
                    <div class='footer'>
                    &copy; {DateTime.UtcNow.Year} School Management System. All rights reserved.
                    </div>
                </div>
                </body>
                </html>
                ";

            await _emails.SendEmailAsync(user.ContactEmail, "Reset Your Password", html);
            return Ok();
        }

        [HttpPost("reset-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDTO req)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var user = await _context.Users
                .FirstOrDefaultAsync(u =>
                    u.ResetPasswordToken == req.Token &&
                    u.ResetPasswordTokenExpiry > DateTime.UtcNow && u.Role == "Teacher"    // ← ensure it’s a teacher[26th]
        );

            if (user == null)
                return BadRequest("Your Time has Expired Please Get a new link to reset your password.");

            user.PasswordHash = req.NewPassword; // TODO: hash in real app
            user.ResetPasswordToken = null;
            user.ResetPasswordTokenExpiry = null;
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}

