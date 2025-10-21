using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using SchoolApp.Models;
using SchoolApp.Services;

namespace SchoolApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoticeController : ControllerBase
    {
        private readonly INoticeService _noticeService;
        private readonly IUploadService _uploadService;
        private readonly IWebHostEnvironment _env;

        public NoticeController(INoticeService noticeService, IUploadService uploadService, IWebHostEnvironment env)
        {
            _noticeService = noticeService;
            _uploadService = uploadService;
            _env = env;
        }

        [HttpGet]
        public IActionResult GetAllNotices()
        {
            return Ok(_noticeService.GetAllNotices());
        }

        [HttpGet("{id}")]
        public IActionResult GetNoticeById(int id)
        {
            var notice = _noticeService.GetNoticeById(id);
            if (notice == null) return NotFound();
            return Ok(notice);
        }

        // [HttpPost]
        // public async Task<IActionResult> AddNotice([FromForm] Notice notice, [FromForm] IFormFile file)
        // {
        //     var uploadPath = Path.Combine(_env.WebRootPath ?? "wwwroot", "notices");
        //     var uploadedFile = await _uploadService.UploadFileAsync(file, uploadPath);
        //     notice.NoticeContent = uploadedFile.FilePath;
        //     _noticeService.AddNotice(notice);

        //     return CreatedAtAction(nameof(GetNoticeById), new { id = notice.NoticeID }, notice);
        // }
        [HttpPost]
        public async Task<IActionResult> AddNotice([FromForm] Notice notice, [FromForm] IFormFile? file)
        {
            if (file != null && file.Length > 0)
            {
                var uploadPath = Path.Combine(_env.WebRootPath ?? "wwwroot", "notices");
                var uploadedFile = await _uploadService.UploadFileAsync(file, uploadPath);
                notice.NoticeContent = uploadedFile.StoredFileName;
            }
            
            _noticeService.AddNotice(notice);

            return CreatedAtAction(nameof(GetNoticeById), new { id = notice.NoticeID }, notice);
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNotice(int id, [FromForm] Notice notice, [FromForm] IFormFile? file)
        {
            if (id != notice.NoticeID) return BadRequest();

            if (file != null && file.Length > 0)
            {
                var uploadPath = Path.Combine(_env.WebRootPath ?? "wwwroot", "notices");
                var uploadedFile = await _uploadService.UploadFileAsync(file, uploadPath);
                notice.NoticeContent = uploadedFile.StoredFileName;
            }

            _noticeService.UpdateNotice(notice);
            return Ok(notice);
        }

        // [HttpPut("{id}")]
        // public IActionResult UpdateNotice(int id, [FromBody] Notice notice, [FromForm] IFormFile? file)
        // {
        //     if (id != notice.NoticeID) return BadRequest();
        //     _noticeService.UpdateNotice(notice);
        //     return NoContent();
        // }

        [HttpDelete("{id}")]
        public IActionResult DeleteNotice(int id)
        {
            _noticeService.DeleteNotice(id);
            return NoContent();
        }
    }
}
