using System.Collections.Generic;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public interface IAttendanceService
    {
        int MarkAttendanceAsync(string cls, DateTime date, List<Attendance> attendance);
        Task<object> GetAttendanceByDateAsync(DateTime date, int classId);
        Task<IEnumerable<Attendance>> GetStudentAttendanceAsync(Guid studentId);
        Task<bool> UpdateAttendanceAsync(Attendance attendance);
    }
}
