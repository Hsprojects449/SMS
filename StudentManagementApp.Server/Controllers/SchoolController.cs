using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using SchoolApp.Models;
using SchoolApp.Services;

namespace SchoolApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SchoolController : ControllerBase
    {
        private readonly ISchoolService _schoolService;

        public SchoolController(ISchoolService schoolService)
        {
            _schoolService = schoolService;
        }

        [HttpGet]
        public IActionResult GetAllSchools()
        {
            return Ok(_schoolService.GetAllSchools());
        }

        [HttpGet("{id}")]
        public IActionResult GetSchoolById(Guid id)
        {
            var school = _schoolService.GetSchoolById(id);
            if (school == null) return NotFound();
            return Ok(school);
        }

        [HttpPost]
        public IActionResult AddSchool([FromBody] School school)
        {
            _schoolService.AddSchool(school);
            return CreatedAtAction(nameof(GetSchoolById), new { id = school.SchoolID }, school);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateSchool(Guid id, [FromBody] School school)
        {
            if (id != school.SchoolID) return BadRequest();
            _schoolService.UpdateSchool(school);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteSchool(Guid id)
        {
            _schoolService.DeleteSchool(id);
            return NoContent();
        }
    }
}
