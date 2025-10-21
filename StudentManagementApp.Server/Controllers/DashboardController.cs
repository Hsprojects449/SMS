using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using SchoolApp.Models;
using SchoolApp.Services;

namespace SchoolApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }
        [HttpGet("AdminDashboard")]
        public IActionResult GetAdminDashboard()
        {
            return Ok(_dashboardService.GetAdminDashboard());
        }
        [HttpGet("StudentDashboard/{SID}")]
        public IActionResult GetStudentDashboard(Guid SID)
        {
            return Ok(_dashboardService.GetStudentDashboard(SID));
        }
        [HttpGet("TeacherDashboard/{TID}")]
        public IActionResult GetTeacherDashboard(Guid TID)
        {
            return Ok(_dashboardService.GetTeacherDashboard(TID));
        }
    }
}
