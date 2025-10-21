using System.Collections.Generic;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public interface IDashboardService
    {
        Dictionary<string, object> GetAdminDashboard();
        Dictionary<string, object> GetStudentDashboard(Guid SID);
        Dictionary<string, object> GetTeacherDashboard(Guid TID);
    }
}
