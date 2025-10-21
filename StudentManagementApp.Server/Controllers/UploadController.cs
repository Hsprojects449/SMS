using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using SchoolApp.Models;
using SchoolApp.Services;

namespace SchoolApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly IUploadService _service;
        private readonly IWebHostEnvironment _env;

        public UploadController(IUploadService service, IWebHostEnvironment env)
        {
            _service = service;
            _env = env;
        }

        [HttpPost]
        public async Task<IActionResult> Upload([FromForm] IFormFile file)
        {
            var uploadPath = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
            var uploaded = await _service.UploadFileAsync(file, uploadPath);
            return Ok(uploaded);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var files = await _service.GetAllFilesAsync();
            return Ok(files);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var file = await _service.GetFileAsync(id);
            return file != null ? Ok(file) : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var uploadPath = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
            var success = await _service.DeleteFileAsync(id, uploadPath);
            return success ? Ok() : NotFound();
        }
    }
}