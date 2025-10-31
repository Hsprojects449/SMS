using Microsoft.AspNetCore.Mvc;
using SchoolApp.Models;
using SchoolApp.Services;

namespace SchoolApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HostelController : ControllerBase
    {
        private readonly IHostelService _hostelService;
        public HostelController(IHostelService hostelService)
        {
            _hostelService = hostelService;
        }
        [HttpGet]
        public IActionResult GetAllHostels()
        {
            return Ok(_hostelService.GetAllHostels());
        }

        [HttpGet("{id}")]
        public IActionResult GetHostelById(Guid id)
        {
            var hostel = _hostelService.GetHostelById(id);
            if (hostel == null) return NotFound();
            return Ok(hostel);
        }

        [HttpPost]
        public IActionResult AddHostel([FromBody] Hostel hostel)
        {
            _hostelService.AddHostel(hostel);
            return CreatedAtAction(nameof(GetHostelById), new { id = hostel.HostelID }, hostel);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateHostel(Guid id, [FromBody] Hostel hostel)
        {
            if (id != hostel.HostelID) return BadRequest();
            _hostelService.UpdateHostel(hostel);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteHostel(Guid id)
        {
            _hostelService.DeleteHostel(id);
            return NoContent();
        }
    }
}