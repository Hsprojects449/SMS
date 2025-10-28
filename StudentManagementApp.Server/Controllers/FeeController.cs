using Microsoft.AspNetCore.Mvc;
using SchoolApp.Models;
using SchoolApp.Services;

namespace SchoolApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeeController : ControllerBase
    {
        private readonly IFeeService _feeService;
        public FeeController(IFeeService feeService)
        {
            _feeService = feeService;
        }
        [HttpGet]
        public IActionResult GetAllFees()
        {
            return Ok(_feeService.GetAllFees());
        }

        [HttpGet("{id}")]
        public IActionResult GetFeeById(Guid id)
        {
            var fee = _feeService.GetFeeById(id);
            if (fee == null) return NotFound();
            return Ok(fee);
        }

        [HttpPost]
        public IActionResult AddFee([FromBody] Fee fee)
        {
            _feeService.AddFee(fee);
            return CreatedAtAction(nameof(GetFeeById), new { id = fee.FeeID }, fee);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateFee(Guid id, [FromBody] Fee fee)
        {
            if (id != fee.FeeID) return BadRequest();
            _feeService.UpdateFee(fee);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteFee(Guid id)
        {
            _feeService.DeleteFee(id);
            return NoContent();
        }
    }
}