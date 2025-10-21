using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using SchoolApp.Models;
using SchoolApp.Services;

namespace SchoolApp.Services
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _studentService;
        private readonly IUploadService _uploadService;
        private readonly IWebHostEnvironment _env;

        public StudentController(IStudentService studentService, IUploadService uploadService, IWebHostEnvironment env)
        {
            _studentService = studentService;
            _uploadService = uploadService;
            _env = env;
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetAllStudents() => Ok(_studentService.GetAllStudents());

        [HttpGet("id/{id}")]
        public IActionResult GetStudentById(Guid id)
        {
            var student = _studentService.GetStudentById(id);
            return student == null ? NotFound() : Ok(student);
        }

        [HttpGet("UserID/{id}")]
        public IActionResult GetStudentByUserId(string id)
        {
            var student = _studentService.GetStudentByUserId(id);
            return student == null ? NotFound() : Ok(student);
        }

        [HttpGet("class/{clsID}")]
        public IActionResult GetStudentByClassID(int clsID)
        {
            var student = _studentService.GetStudentByClassID(clsID);
            return student == null ? NotFound() : Ok(student);
        }

        [HttpPost]
        public IActionResult AddStudent([FromBody] Student student)
        {
            _studentService.AddStudent(student);
            return CreatedAtAction(nameof(GetStudentById), new { id = student.StudentID }, student);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateStudent(Guid id, [FromBody] Student student)
        {
            if (id != student.StudentID) return BadRequest();
            _studentService.UpdateStudent(student);
            return NoContent();
        }

        [HttpPut("MedicalRecord/{SID}")]
        public async Task<IActionResult> UpdateStudentMedicalRecord(Guid SID, [FromForm] IFormFile? file)
        {
            string? uploadedFilePath = null;

            if (file != null && file.Length > 0)
            {
                var uploadPath = Path.Combine(_env.WebRootPath ?? "wwwroot", "medicalRecord");
                var uploadedFile = await _uploadService.UploadFileAsync(file, uploadPath);
                uploadedFilePath = uploadedFile.StoredFileName;
            }

            _studentService.UpdateStudentMedicalRecord(SID, uploadedFilePath);
            return Ok(uploadedFilePath);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteStudent(Guid id)
        {
            _studentService.DeleteStudent(id);
            return NoContent();
        }
    }
}
