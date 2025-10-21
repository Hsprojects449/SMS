using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using SchoolApp.Models;
using SchoolApp.Services;

namespace SchoolApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestAssignmentController : ControllerBase
    {
        private readonly ITestAssignmentService _testAssignmentService;

        public TestAssignmentController(ITestAssignmentService testAssignmentService)
        {
            _testAssignmentService = testAssignmentService;
        }

        [HttpGet]
        public IActionResult GetAllTestAssignments() => Ok(_testAssignmentService.GetAllTestAssignments());

        [HttpGet("{id}")]
        public IActionResult GetTestAssignmentById(int id)
        {
            var testAssignment = _testAssignmentService.GetTestAssignmentById(id);
            return testAssignment == null ? NotFound() : Ok(testAssignment);
        }

        [HttpPost]
        public IActionResult AddTestAssignment([FromBody] TestAssignment testAssignment)
        {
            _testAssignmentService.AddTestAssignment(testAssignment);
            return CreatedAtAction(nameof(GetTestAssignmentById), new { id = testAssignment.AssignmentID }, testAssignment);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTestAssignment(int id, [FromBody] TestAssignment testAssignment)
        {
            if (id != testAssignment.AssignmentID) return BadRequest();
            _testAssignmentService.UpdateTestAssignment(testAssignment);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTestAssignment(int id)
        {
            _testAssignmentService.DeleteTestAssignment(id);
            return NoContent();
        }
    }
}
