using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using SchoolApp.Models;
using SchoolApp.Services;

namespace SchoolApp.Controllers
{    
    [Route("api/[controller]")]
    [ApiController]
    public class TeacherController : ControllerBase
    {
        private readonly ITeacherService _teacherService;

        public TeacherController(ITeacherService teacherService)
        {
            _teacherService = teacherService;
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetAllTeachers() => Ok(_teacherService.GetAllTeachers());

        [HttpGet("{id}")]
        [Authorize] 
        public IActionResult GetTeacherById(Guid id)
        {
            var teacher = _teacherService.GetTeacherById(id);
            return teacher == null ? NotFound() : Ok(teacher);
        }

        [HttpGet("UserID/{id}")]
        public IActionResult GetTeacherByUserId(string id)
        {
            var student = _teacherService.GetTeacherByUserId(id);
            return student == null ? NotFound() : Ok(student);
        }

        [HttpPost]
        public IActionResult AddTeacher([FromBody] Teacher teacher)
        {
            _teacherService.AddTeacher(teacher);
            return CreatedAtAction(nameof(GetTeacherById), new { id = teacher.TeacherID }, teacher);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTeacher(Guid id, [FromBody] Teacher teacher)
        {
            if (id != teacher.TeacherID) return BadRequest();
            _teacherService.UpdateTeacher(teacher);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTeacher(Guid id)
        {
            _teacherService.DeleteTeacher(id);
            return NoContent();
        }
    }
}