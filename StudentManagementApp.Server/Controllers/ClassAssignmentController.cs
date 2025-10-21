using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using SchoolApp.Models;
using SchoolApp.Services;
//not used
namespace SchoolApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassAssignmentController : ControllerBase
    {
        private readonly IClassAssignmentService _classAssignmentService;

        public ClassAssignmentController(IClassAssignmentService classAssignmentService)
        {
            _classAssignmentService = classAssignmentService;
        }

        [HttpGet]
        public IActionResult GetAllClassAssignments() => Ok(_classAssignmentService.GetAllClassAssignments());

        [HttpGet("{id}")]
        public IActionResult GetClassAssignmentById(int id)
        {
            var classAssignment = _classAssignmentService.GetClassAssignmentById(id);
            return classAssignment == null ? NotFound() : Ok(classAssignment);
        }

        [HttpPost]
        public IActionResult AddClassAssignment([FromBody] ClassAssignment classAssignment)
        {
            _classAssignmentService.AddClassAssignment(classAssignment);
            return CreatedAtAction(nameof(GetClassAssignmentById), new { id = classAssignment.AssignmentID }, classAssignment);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateClassAssignment(int id, [FromBody] ClassAssignment classAssignment)
        {
            if (id != classAssignment.AssignmentID) return BadRequest();
            _classAssignmentService.UpdateClassAssignment(classAssignment);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteClassAssignment(int id)
        {
            _classAssignmentService.DeleteClassAssignment(id);
            return NoContent();
        }
    }
}
