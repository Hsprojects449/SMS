using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using SchoolApp.Models;
using SchoolApp.Services;

namespace SchoolApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SyllabusController : ControllerBase
    {
        private readonly ISyllabusService _syllabusService;
        private readonly IUploadService _uploadService;
        private readonly IWebHostEnvironment _env;

        public SyllabusController(ISyllabusService syllabusService, IUploadService uploadService, IWebHostEnvironment env)
        {
            _syllabusService = syllabusService;
            _uploadService = uploadService;
            _env = env;
        }

        [HttpGet]
        public IActionResult GetAllSyllabus()
        {
            return Ok(_syllabusService.GetAllSyllabus());
        }

        [HttpGet("{id}")]
        public IActionResult GetSyllabusById(int id)
        {
            var cls = _syllabusService.GetSyllabusById(id);
            if (cls == null) return NotFound();
            return Ok(cls);
        }

        [HttpGet("Class/{id}")]
        public IActionResult GetSyllabusByClassId(int id)
        {
            var cls = _syllabusService.GetSyllabusByClassId(id);
            if (cls == null) return NotFound();
            return Ok(cls);
        }

        [HttpPost]
        public IActionResult AddSyllabus([FromBody] Syllabus newSyllabus)
        {
            _syllabusService.AddSyllabus(newSyllabus);
            return CreatedAtAction(nameof(GetSyllabusById), new { id = newSyllabus.SyllabusID }, newSyllabus);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Syllabus updatedSyllabus)
        {
            if (id != updatedSyllabus.SyllabusID) return BadRequest();
            _syllabusService.UpdateSyllabus(updatedSyllabus);
            return NoContent();
        }

        [HttpPut("SyllabusFile/{id}")]
        public async Task<IActionResult> UpdateSyllabusFile(int id, [FromForm] IFormFile? file)
        {
            string? uploadedFilePath = null;

            if (file != null && file.Length > 0)
            {
                var uploadPath = Path.Combine(_env.WebRootPath ?? "wwwroot", "syllabus");
                var uploadedFile = await _uploadService.UploadFileAsync(file, uploadPath);
                uploadedFilePath = uploadedFile.StoredFileName; // Or use the correct property
            }

            _syllabusService.UpdateSyllabusFile(id, uploadedFilePath);

            return Ok(new { uploadedFilePath });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _syllabusService.DeleteSyllabus(id);
            return NoContent();
        }
    }
}
