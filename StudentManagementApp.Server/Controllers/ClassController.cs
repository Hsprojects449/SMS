using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using SchoolApp.Models;
using SchoolApp.Services;

namespace SchoolApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassController : ControllerBase
    {
        private readonly IClassService _classService;

        public ClassController(IClassService classService)
        {
            _classService = classService;
        }

        [HttpGet]
        public IActionResult GetAllClasses()
        {
            return Ok(_classService.GetAllClasses());
        }

        [HttpGet("{id}")]
        public IActionResult GetClassById(int id)
        {
            var cls = _classService.GetClassById(id);
            if (cls == null) return NotFound();
            return Ok(cls);
        }

        [HttpGet("ClassName/{name}")]
        public IActionResult GetClassByName(string name)
        {
            var cls = _classService.GetClassByName(name);
            if (cls == null) return NotFound();
            return Ok(cls);
        }

        [HttpPost]
        public IActionResult AddClass([FromBody] Class newClass)
        {
            _classService.AddClass(newClass);
            return CreatedAtAction(nameof(GetClassById), new { id = newClass.ClassID }, newClass);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Class updatedClass)
        {
            if (id != updatedClass.ClassID) return BadRequest();
            _classService.UpdateClass(updatedClass);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _classService.DeleteClass(id);
            return NoContent();
        }
    }
}
