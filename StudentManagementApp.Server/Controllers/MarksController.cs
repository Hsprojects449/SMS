using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using SchoolApp.Models;
using SchoolApp.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MarksController : ControllerBase
    {
        private readonly IMarkService _markService;

        public MarksController(IMarkService markService)
        {
            _markService = markService;
        }

        [HttpGet]
        public IActionResult GetAllMarks()
        {
            return Ok(_markService.GetAllMarks());
        }
        
        [HttpGet("class-subject-marks/{cls}/{sub}")]
        public IActionResult GetMarksByClassandSubject(string cls, string sub)
        {
            var mrk = _markService.GetMarksByClassandSubject(cls, sub);
            if (mrk == null) return NotFound();
            return Ok(mrk);
        }
        
        [HttpGet("student/{SID}")]
        public IActionResult GetMarksforStudent(Guid SID)
        {
            var mrk = _markService.GetMarksforStudent(SID);
            if (mrk == null) return NotFound();
            return Ok(mrk);
        }
        
        [HttpGet("{id}")]
        public IActionResult GetMarksById(int id)
        {
            var mrk = _markService.GetMarksById(id);
            if (mrk == null) return NotFound();
            return Ok(mrk);
        }

        [HttpPost("{cls}/{sub}")]
        public async Task<IActionResult> AddMark(string cls, string sub, [FromBody] List<Mark> newMarks)
        {
            var result = await _markService.AddMark(cls, sub, newMarks);
            return Ok(result);
        }

        [HttpPut("Marks/{id}")]
        public IActionResult UpdateMark(int id, [FromBody] Mark updatedMark)
        {
            if (id != updatedMark.MarkID) return BadRequest();
            _markService.UpdateMark(updatedMark);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteMark(int id)
        {
            _markService.DeleteMark(id);
            return NoContent();
        }
    }
}
