using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using SchoolApp.Models;
using SchoolApp.Services;

namespace SchoolApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TimetableController : ControllerBase
    {
        private readonly ITimetableService _timetableService;

        public TimetableController(ITimetableService timetableService)
        {
            _timetableService = timetableService;
        }

        [HttpPost]
        public async Task<IActionResult> AddTimetable([FromBody] List<TimetableDto> timetables)
        {
            if (timetables == null || !timetables.Any())
                return BadRequest("No timetables provided");
            var result = await _timetableService.AddTimetableAsync(timetables);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetTimetables()
        {
            return Ok(await _timetableService.GetTimetablesAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTimetableById(int id)
        {
            var result = await _timetableService.GetTimetableByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("class/{classId}/day/{dayOfWeek}")]
        public async Task<IActionResult> GetClassTimetable(int classId, int dayOfWeek)
        {
            return Ok(await _timetableService.GetClassTimetableAsync(classId, dayOfWeek));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTimetable(int id)
        {
            var success = await _timetableService.DeleteTimetableAsync(id);
            return success ? NoContent() : NotFound();
        }
    }
}
