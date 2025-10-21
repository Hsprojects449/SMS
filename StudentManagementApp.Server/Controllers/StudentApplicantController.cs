using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using SchoolApp.Models;
using SchoolApp.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using System.Text.Json;
using System.Net.Http;

namespace SchoolApp.Services
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentApplicantController : ControllerBase
    {
        private readonly SchoolContext _context;
        private readonly IEmailService _emailService;
        private readonly IUploadService _uploadService;
        private readonly IWebHostEnvironment _env;

        public StudentApplicantController(IEmailService emailService, SchoolContext context, IUploadService uploadService, IWebHostEnvironment env)
        {
            _emailService = emailService;
            _context = context;
            _uploadService = uploadService;
            _env = env;
        }

        // [HttpGet]
        // public IActionResult GetAllStudentApplicants() => Ok(_studentApplicantService.GetAllStudentApplicants());

        // [HttpGet("{id}")]
        // public IActionResult GetStudentApplicantById(int id)
        // {
        //     var studentapplicant = _studentApplicantService.GetStudentApplicantById(id);
        //     return studentapplicant == null ? NotFound() : Ok(studentapplicant);
        // }

        // [HttpPost]
        // public IActionResult AddStudentApplicant([FromBody] StudentApplicant studentApplicant)
        // {
        //     _studentApplicantService.AddStudentApplicant(studentApplicant);
        //     return CreatedAtAction(nameof(GetStudentApplicantById), new { id = studentApplicant.StudentApplicantID }, studentApplicant);
        // }

        // [HttpDelete("{id}")]
        // public IActionResult DeleteStudentApplicant(int id)
        // {
        //     _studentApplicantService.DeleteStudentApplicant(id);
        //     return NoContent();
        // }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Create([FromForm] StudentApplicant rq, [FromForm] IFormFile? file)
        {
            // ✋ Check email uniqueness across Users and pending Requests
            if (_context.Users.Any(u => u.ContactEmail == rq.ContactEmail) ||
                _context.StudentApplicants.Any(r => r.ContactEmail == rq.ContactEmail))
            {
                return BadRequest("Email already registered or pending approval.");
            }
            if (file != null && file.Length > 0)
            {
                var uploadPath = Path.Combine(_env.WebRootPath ?? "wwwroot", "profile");
                var ProfilePicture = await _uploadService.UploadFileAsync(file, uploadPath);
                rq.ProfilePicture = ProfilePicture.StoredFileName;
            }
            rq.StudentApplicantID = Guid.NewGuid();
            rq.RequestedAt = DateTime.UtcNow;
            _context.StudentApplicants.Add(rq);
            await _context.SaveChangesAsync();
            // return Accepted(new { rq.StudentApplicantID });
            return Accepted(rq);
        }

        // Admin: list all pending requests
        [HttpGet, Authorize]
        public Task<List<StudentApplicant>> List()
            => _context.StudentApplicants
                       .OrderBy(r => r.RequestedAt)
                       .ToListAsync();

        // Admin: reject (delete) one
        [HttpDelete("{id}/reject"), Authorize(Roles = "SysAdmin")]
        public async Task<IActionResult> Reject(Guid id)
        {
            var rq = await _context.StudentApplicants.FindAsync(id);
            if (rq == null) return NotFound();
            _context.StudentApplicants.Remove(rq);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Admin: approve one → move into real Students & Users
        [HttpPost("{id}/approve"), Authorize(Roles = "SysAdmin")]
        public async Task<IActionResult> Approve(Guid id)
        {
            var rq = await _context.StudentApplicants.FindAsync(id);
            if (rq == null) return NotFound();
            //25th date code added GenerateCode
            string GenerateCode()
            {
                var rng = new Random();
                string code;
                do
                {
                    var letters = new string(Enumerable.Range(0, 4)
                        .Select(_ => (char)('A' + rng.Next(26))).ToArray());
                    var digits = rng.Next(0, 10000).ToString("D4");
                    code = letters + digits;
                } while (_context.Users.Any(u => u.UserID == code));
                return code;
            }
            var userCode = GenerateCode();

            // 1) create User + Student exactly as your CreateStudent logic
            var user = new User
            {
                UserID = userCode,
                ContactEmail = rq.ContactEmail,
                Name = rq.Name,
                // Req: student’s initial password must equal their UserID
                PasswordHash = userCode,
                Role = "Student",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                // assigns your unique school via helper:
                SchoolID = (await _context.Schools.FirstAsync()).SchoolID
            };
            var student = new Student
            {
                StudentID = Guid.NewGuid(),
                //UserID = user.UserID,[25th date]
                UserID = userCode,  
                Gender = rq.Gender,
                Name = rq.Name,
                ContactEmail = rq.ContactEmail,
                ParentName = rq.ParentName,
                ParentPhone = rq.ParentPhone,
                Address = rq.Address,
                MedicalRecordPath = null,
                Class = rq.Class,
                ClassID = rq.ClassID,
                DOB = rq.DOB,
                ProfilePicture = rq.ProfilePicture,

                // ✅ New fields copied from Applicant
                PhoneNumber = rq.PhoneNumber,
                BloodGroup = rq.BloodGroup,
                Religion = rq.Religion,
                Nationality = rq.Nationality,
                AadhaarNo = rq.AadhaarNo,
                Caste = rq.Caste
            };

            _context.Users.Add(user);
            _context.Students.Add(student);
            _context.StudentApplicants.Remove(rq);
            await _context.SaveChangesAsync();

            using var httpClient = new HttpClient();
            string baseUrl = "https://vcallz.com/json/push";

            var requestData = new Dictionary<string, string>
            {
                { "username", "villatr" },
                { "password", "123456" },
                { "mobile", rq.ParentPhone },
                { "retry", "1" },
                { "retrytime", "0" },
                { "campid", "3cbf9be462c111efb22b0cc47a338ee6" }
            };

            string jsonContent = JsonSerializer.Serialize(requestData);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            await httpClient.PostAsync(baseUrl, content);

            var subject = "Your SMSApp Student Account Credentials";
            // var body = $@"
            //            Hello {rq.Name},<br/><br/>
            //            Your account has been approved.<br/>
            //            Your login ID is: <strong>{user.UserID}</strong><br/>
            //            Your Permanent password is: <strong>{user.PasswordHash}</strong><br/><br/>
            //             ";

            var body = $@"
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset=""UTF-8"">
              <title>Your SMSApp Student Account Credentials</title>
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
                      Your Student account has been approved successfully. Below are your login credentials:
                    </p>

                    <p style=""font-size:15px; color:#555; margin:20px 0;"">
                      <strong>Login ID:</strong> {user.UserID}<br/>
                      <strong>Permanent Password:</strong> {user.PasswordHash}
                    </p>

                    <p style=""font-size:15px; color:#555;"">
                      You can now log in using the above credentials. Please make sure to keep your password secure.
                    </p>

                    <p style=""font-size:13px; color:#888;"">
                      If you face any issues logging in, contact our support team.
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
                rq.ContactEmail,
                subject,
                body
            );
            return Accepted(student);
        }
    }
}
