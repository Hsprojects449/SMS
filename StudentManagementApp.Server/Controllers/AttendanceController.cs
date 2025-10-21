using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using SchoolApp.Models;
using SchoolApp.Services;
//not using
namespace SchoolApp.Controllers
{
    // AttendanceController.cs
    [ApiController]
    [Route("api/[controller]")]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public AttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        [HttpPost("{cls}/{date}")]
        public async Task<IActionResult> MarkAttendance(string cls, DateTime date, [FromBody] List<Attendance> attendance)
        {
            _attendanceService.MarkAttendanceAsync(cls, date, attendance);
            return Ok();
        }

        [HttpGet("date/{date}/class/{classId}")]
        public async Task<IActionResult> GetAttendanceByDate(DateTime date, int classId)
        {
            return Ok(await _attendanceService.GetAttendanceByDateAsync(date, classId));
        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetStudentAttendance(Guid studentId)
        {
            return Ok(await _attendanceService.GetStudentAttendanceAsync(studentId));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAttendance([FromBody] Attendance attendance)
        {
            var success = await _attendanceService.UpdateAttendanceAsync(attendance);
            return success ? NoContent() : NotFound();
        }
    }
}
