using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using SchoolApp.Models;
using SchoolApp.Services;

namespace SchoolApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusController : ControllerBase
    {
        private readonly IBusService _busService;

        public BusController(IBusService busService)
        {
            _busService = busService;
        }

        [HttpGet]
        public IActionResult GetAllBuses() => Ok(_busService.GetAllBuses());

        [HttpGet("{id}")]
        public IActionResult GetBusById(int id)
        {
            var bus = _busService.GetBusById(id);
            if (bus == null) return Ok(new { });
            return Ok(bus);
        }

        [HttpPost]
        public IActionResult AddBus([FromBody] Bus bus)
        {
            _busService.AddBus(bus);
            return CreatedAtAction(nameof(GetBusById), new { id = bus.BusID }, bus);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateBus(int id, [FromBody] Bus bus)
        {
            if (id != bus.BusID) return BadRequest();
            _busService.UpdateBus(bus);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteBus(int id)
        {
            _busService.DeleteBus(id);
            return NoContent();
        }
    }
}
