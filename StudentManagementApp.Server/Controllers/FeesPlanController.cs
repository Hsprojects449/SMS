using Microsoft.AspNetCore.Mvc;
using SchoolApp.Models;
using SchoolApp.Services;

namespace SchoolApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeesPlanController : ControllerBase
    {
        private readonly IFeesPlanService _feesPlanService;
        public FeesPlanController(IFeesPlanService feesPlanService)
        {
            _feesPlanService = feesPlanService;
        }
        [HttpGet]
        public IActionResult GetAllFeesPlans()
        {
            return Ok(_feesPlanService.GetAllFeesPlans());
        }

        [HttpGet("{id}")]
        public IActionResult GetFeesPlanById(Guid id)
        {
            var feesPlan = _feesPlanService.GetFeesPlanById(id);
            if (feesPlan == null) return NotFound();
            return Ok(feesPlan);
        }

        [HttpPost]
        public IActionResult AddFeesPlan([FromBody] FeesPlan feesPlan)
        {
            _feesPlanService.AddFeesPlan(feesPlan);
            return CreatedAtAction(nameof(GetFeesPlanById), new { id = feesPlan.FeePlanID }, feesPlan);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateFeesPlan(Guid id, [FromBody] FeesPlan feesPlan)
        {
            if (id != feesPlan.FeePlanID) return BadRequest();
            _feesPlanService.UpdateFeesPlan(feesPlan);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteFeesPlan(Guid id)
        {
            _feesPlanService.DeleteFeesPlan(id);
            return NoContent();
        }
    }
}