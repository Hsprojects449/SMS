using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using SchoolApp.Models;
using SchoolApp.Services;

namespace SchoolApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MockTestController : ControllerBase
    {
        private readonly IMockTestService _mockTestService;

        public MockTestController(IMockTestService mockTestService)
        {
            _mockTestService = mockTestService;
        }

        [HttpGet]
        public IActionResult GetAllMockTests() => Ok(_mockTestService.GetAllMockTests());

        [HttpGet("{id}")]
        public IActionResult GetMockTestById(int id)
        {
            var mockTest = _mockTestService.GetMockTestById(id);
            return mockTest == null ? NotFound() : Ok(mockTest);
        }

        [HttpGet("Student/{cls}/{subject}")]
        public IActionResult GetMockTestforStudent(string cls, string subject)
        {
            var mockTest = _mockTestService.GetMockTestforStudent(cls, subject);
            return mockTest == null ? NotFound() : Ok(mockTest);
        }

        [HttpPost]
        public IActionResult AddMockTest([FromBody] MockTest mockTest)
        {
            _mockTestService.AddMockTest(mockTest);
            return CreatedAtAction(nameof(GetMockTestById), new { id = mockTest.TestID }, mockTest);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateMockTest(int id, [FromBody] MockTest mockTest)
        {
            if (id != mockTest.TestID) return BadRequest();
            _mockTestService.UpdateMockTest(mockTest);
            return NoContent();
        }

        [HttpPut("status/{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromQuery] bool status)
        {
            var result = await _mockTestService.UpdateMockTestStatusAsync(id, status);
            if (!result)
                return NotFound("Mock test not found.");

            return Ok("Status updated successfully.");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteMockTest(int id)
        {
            _mockTestService.DeleteMockTest(id);
            return NoContent();
        }
    }
}
