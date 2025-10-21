using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using SchoolApp.Models;
using SchoolApp.Services;
using static Org.BouncyCastle.Math.EC.ECCurve;
using static System.Net.WebRequestMethods;
using System.Threading.Tasks;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using System.Text.Json;
using System.Net.Http;

namespace SchoolApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeacherApplicantController : ControllerBase
    {
        // private readonly ITeacherApplicantService _teacherApplicantService;
        private readonly SchoolContext _context;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _config;
        private readonly IUploadService _uploadService;
        private readonly IWebHostEnvironment _env;

        public TeacherApplicantController(SchoolContext context, IEmailService emailService, IConfiguration config, IUploadService uploadService, IWebHostEnvironment env)
        {
            // _teacherApplicantService = teacherApplicantService;
            _context = context;
           _emailService = emailService;
           _config = config;
            _uploadService = uploadService;
            _env = env;
        }

        // [HttpGet]
        // public IActionResult GetAllTeacherApplicants() => Ok(_teacherApplicantService.GetAllTeacherApplicants());

        // [HttpGet("{id}")]
        // public IActionResult GetTeacherApplicantById(int id)
        // {
        //     var teacherapplicant = _teacherApplicantService.GetTeacherApplicantById(id);
        //     return teacherapplicant == null ? NotFound() : Ok(teacherapplicant);
        // }

        // [HttpPost]
        // public IActionResult AddTeacherApplicant([FromBody] TeacherApplicant teacherApplicant)
        // {
        //     _teacherApplicantService.AddTeacherApplicant(teacherApplicant);
        //     return CreatedAtAction(nameof(GetTeacherApplicantById), new { id = teacherApplicant.TeacherApplicantID }, teacherApplicant);
        // }

        // [HttpDelete("{id}")]
        // public IActionResult DeleteTeacherApplicant(int id)
        // {
        //     _teacherApplicantService.DeleteTeacherApplicant(id);
        //     return NoContent();
        // }
        [HttpPost]
        [AllowAnonymous]

        public async Task<IActionResult> Create([FromForm] TeacherApplicant rq, [FromForm] IFormFile? file)
        {            // — Req 2: ensure email is not already in Users or pending [26th]
            if (_context.Users.Any(u => u.ContactEmail == rq.ContactEmail) ||
                _context.TeacherApplicants.Any(r => r.ContactEmail == rq.ContactEmail))
            {
                return BadRequest("Email already registered or pending approval.");
            }
            if (file != null && file.Length > 0)
            {
                var uploadPath = Path.Combine(_env.WebRootPath ?? "wwwroot", "profile");
                var ProfilePicture = await _uploadService.UploadFileAsync(file, uploadPath);
                rq.ProfilePicture = ProfilePicture.StoredFileName;
            }
            rq.TeacherApplicantID = Guid.NewGuid();
            rq.RequestedAt = DateTime.UtcNow;
            _context.TeacherApplicants.Add(rq);
            await _context.SaveChangesAsync();
            // return Accepted(new { rq.TeacherApplicantID });
            return Accepted(rq);
        }

        // Admin: list all pending teacher requests
        [HttpGet, Authorize(Roles = "SysAdmin")]
        public Task<List<TeacherApplicant>> List()
            => _context.TeacherApplicants
                       .OrderBy(r => r.RequestedAt)
                       .ToListAsync();

        // Admin: reject (delete) one
        [HttpDelete("{id}/reject"), Authorize(Roles = "SysAdmin")]
        public async Task<IActionResult> Reject(Guid id)
        {
            var rq = await _context.TeacherApplicants.FindAsync(id);
            if (rq == null) return NotFound();
            _context.TeacherApplicants.Remove(rq);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Admin: approve one → create real User+Teacher, then delete the pending row
        [HttpPost("{id}/approve"), Authorize(Roles = "SysAdmin")]
        public async Task<IActionResult> Approve(Guid id)
        {
            var rq = await _context.TeacherApplicants.FindAsync(id);
            if (rq == null) return NotFound();

            // 1) grab the one seeded school
            var school = await _context.Schools.FirstOrDefaultAsync();
            if (school == null)
                return BadRequest("No school configured in the database.");

            // — Req 1: generate a unique 6-char code (AAA000 … ZZZ999) [26th]
            string GenerateCode()
            {
                var rng = new Random();
                string code;
                do
                {
                    var letters = new string(Enumerable.Range(0, 3)
                        .Select(_ => (char)('A' + rng.Next(26))).ToArray());
                    var digits = rng.Next(0, 1000).ToString("D3");
                    code = letters + digits;
                }
                while (_context.Users.Any(u => u.UserID == code));
                return code;
            }
            var userCode = GenerateCode();
            // 2) build real User and generate a 10-char random password [26th]
            string GenerateTeacherPassword()
               {
                 const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                 var rng = new Random();
                       return new string(Enumerable.Range(0, 10)
                      .Select(_ => chars[rng.Next(chars.Length)])
                      .ToArray());
                   }
            
            var generatedPassword = GenerateTeacherPassword();
            // 2) build real User
            var user = new User
            {
                //UserID = Guid.NewGuid(), [26th]
                UserID = userCode,
                ContactEmail = rq.ContactEmail,
                Name = rq.Name,
                //PasswordHash = rq.PasswordHash,[26th]
                PasswordHash = generatedPassword,      // ← now a random 10-char
                Role = "Teacher",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                SchoolID = school.SchoolID
            };

            // 3) build real Teacher
            var teacher = new Teacher
            {
                TeacherID = Guid.NewGuid(),
                UserID = userCode,
                //UserID = user.UserID, [26th]
                Name = rq.Name,
                JoinedAt = rq.RequestedAt,
                Gender = rq.Gender,
                Qualification = rq.Qualification,
                SubjectSpecialization = rq.SubjectSpecialization,
                Experience = rq.Experience,
                DOB = rq.DOB,
                ContactEmail = rq.ContactEmail,
                ContactPhone = rq.ContactPhone,
                Address = rq.Address,
                ProfilePicture = rq.ProfilePicture,
                // ✅ New fields copied from Applicant
                BloodGroup = rq.BloodGroup,
                Religion = rq.Religion,
                Nationality = rq.Nationality,
                AadhaarNo = rq.AadhaarNo,
            };

            _context.Users.Add(user);
            _context.Teachers.Add(teacher);
            // 4) remove the pending row
            _context.TeacherApplicants.Remove(rq);

            //await _context.SaveChangesAsync();
            //// fire off an email to the teacher with their new password
            //var subject = "Your SMSApp Teacher Account Credentials";
            //var body = $@"
            //           Hello {rq.FullName},<br/><br/>
            //           Your account has been approved.<br/>
            //           Your login ID is: <strong>{user.UserID}</strong><br/>
            //           Your temporary password is: <strong>{generatedPassword}</strong><br/><br/>
            //           Please log in and change your password right away.
            //           ";

            //await _emailService.SendEmailAsync(
            //    rq.Email,
            //    subject,
            //    body
            //);  [26th commented]

            // 4) save the new User & Teacher
            await _context.SaveChangesAsync();
            
            using var httpClient = new HttpClient();
            string baseUrl = "https://vcallz.com/json/push";

            var requestData = new Dictionary<string, string>
            {
                { "username", "villatr" },
                { "password", "123456" },
                { "mobile", rq.ContactPhone },
                { "retry", "1" },
                { "retrytime", "0" },
                { "campid", "3cbf9be462c111efb22b0cc47a338ee6" }
            };

            string jsonContent = JsonSerializer.Serialize(requestData);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            await httpClient.PostAsync(baseUrl, content);
            
                // 5) Generate a 6-digit OTP
            var otp = new Random().Next(100000, 999999).ToString();
            
                // 6) Store it as the ResetPasswordToken so your ResetPassword endpoint can pick it up
            user.ResetPasswordToken = otp;
            user.ResetPasswordTokenExpiry = DateTime.UtcNow.AddHours(1);
            await _context.SaveChangesAsync();

            // 7) Email the link (embedding the OTP token) to the teacher
            // var resetUrl = $"{_config["https://school.vsngroups.com"]}/reset-password?token={otp}";
            var resetUrl = $"{_config["FrontendUrl"]}/reset-password?token={otp}";
    //         var html = $@"
    //   <p>Hello {rq.Name},</p>
    //   <p>Your account has just been approved. Your login ID is: <strong>{user.UserID}</strong><br/>
    //      Please <a href=""{resetUrl}"">click here</a> to set your password. 
    //      This link expires in one hour.</p>";
            var html = $@"
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset=""UTF-8"">
              <title>Set Your SMSApp Teacher Password</title>
            </head>
            <body style=""margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;"">
              <table align=""center"" cellpadding=""0"" cellspacing=""0"" width=""600"" 
                     style=""border-collapse: collapse; background-color: #ffffff; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);"">

                <!-- Header -->
                <tr>
                  <td align=""center"" bgcolor=""#4f46e5"" style=""padding: 20px;"">
                    <img src=""https://i.ibb.co/YcCw5rF/school-logo.png"" alt=""School Management System"" width=""80"" style=""display:block;""/>
                    <h2 style=""color:#ffffff; margin:0;"">SMS</h2>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style=""padding: 30px;"">
                    <p style=""font-size:16px; color:#333;"">Hello <strong>{user.Name}</strong>,</p>
                    <p style=""font-size:15px; color:#555;"">
                      Your account has just been approved.<br/>
                      Your Login ID is: <strong>{user.UserID}</strong>
                    </p>
                    <p style=""font-size:15px; color:#555;"">
                      Please click the button below to set your password. This link will expire in <strong>1 hour</strong>.
                    </p>

                    <!-- Button -->
                    <p style=""text-align:center; margin:30px 0;"">
                      <a href=""{resetUrl}"" 
                         style=""background-color:#4f46e5; color:#ffffff; padding:12px 25px; text-decoration:none; 
                                border-radius:5px; font-size:16px; display:inline-block;"">
                        Set My Password
                      </a>
                    </p>

                    <p style=""font-size:13px; color:#888;"">
                      If the button doesn't work, copy and paste this link in your browser:<br/>
                      <a href=""{resetUrl}"" style=""color:#4f46e5;"">{resetUrl}</a>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align=""center"" bgcolor=""#f4f4f4"" style=""padding: 20px; font-size:12px; color:#999;"">
                    © {DateTime.UtcNow.Year} SMS. All rights reserved.<br/>
                    Need help? Contact us at <a href=""mailto:support@smsapp.com"" style=""color:#4f46e5;"">support@smsapp.com</a>
                  </td>
                </tr>
              </table>
            </body>
            </html>";
            await _emailService.SendEmailAsync(
            to: rq.ContactEmail,
            subject: "Set your SMSApp teacher password",
            htmlBody: html
                );
            return Accepted(teacher);
        }
    }
}
