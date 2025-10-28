using Microsoft.AspNetCore.Mvc;
using SchoolApp.Models;
using SchoolApp.Services;

namespace SchoolApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamController : ControllerBase
    {
        private readonly IExamService _examService;
        public ExamController(IExamService examService)
        {
            _examService = examService;
        }
        [HttpGet]
        public IActionResult GetAllExams()
        {
            return Ok(_examService.GetAllExams());
        }

        [HttpGet("{id}")]
        public IActionResult GetExamById(Guid id)
        {
            var exam = _examService.GetExamById(id);
            if (exam == null) return NotFound();
            return Ok(exam);
        }

        [HttpPost]
        public IActionResult AddExam([FromBody] Exam exam)
        {
            _examService.AddExam(exam);
            return CreatedAtAction(nameof(GetExamById), new { id = exam.ExamID }, exam);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateExam(Guid id, [FromBody] Exam exam)
        {
            if (id != exam.ExamID) return BadRequest();
            _examService.UpdateExam(exam);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteExam(Guid id)
        {
            _examService.DeleteExam(id);
            return NoContent();
        }
    }
}