using Microsoft.AspNetCore.Mvc;
using SchoolApp.Models;
using SchoolApp.Services;

namespace SchoolApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExaminationPlanController : ControllerBase
    {
        private readonly IExaminationPlanService _examinationPlanService;
        public ExaminationPlanController(IExaminationPlanService examinationPlanService)
        {
            _examinationPlanService = examinationPlanService;
        }
        [HttpGet]
        public IActionResult GetAllExaminationPlans()
        {
            return Ok(_examinationPlanService.GetAllExaminationPlans());
        }

        [HttpGet("{id}")]
        public IActionResult GetExaminationPlanById(Guid id)
        {
            var examPlan = _examinationPlanService.GetExaminationPlanById(id);
            if (examPlan == null) return NotFound();
            return Ok(examPlan);
        }

        [HttpPost]
        public IActionResult AddExaminationPlan([FromBody] ExaminationPlan examinationPlan)
        {
            _examinationPlanService.AddExaminationPlan(examinationPlan);
            return CreatedAtAction(nameof(GetExaminationPlanById), new { id = examinationPlan.ExamPlanID }, examinationPlan);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateExaminationPlan(Guid id, [FromBody] ExaminationPlan examinationPlan)
        {
            if (id != examinationPlan.ExamPlanID) return BadRequest();
            _examinationPlanService.UpdateExaminationPlan(examinationPlan);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteExaminationPlan(Guid id)
        {
            _examinationPlanService.DeleteExaminationPlan(id);
            return NoContent();
        }
    }
}