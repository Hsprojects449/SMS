using System.Collections.Generic;
using System.Linq;
using SchoolApp.Models;
using SchoolApp.Services;
using Microsoft.EntityFrameworkCore;

namespace SchoolApp.Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly SchoolContext _context;

        public AttendanceService(SchoolContext context)
        {
            _context = context;
        }

        public int MarkAttendanceAsync(string cls, DateTime date, List<Attendance> attendance)
        {
            var existingAttendance = _context.Attendance
                .Where(m => m.Class == cls && m.Date.Date == date.Date)
                .ToList();

            foreach (var att in attendance)
            {
                var existing = existingAttendance.FirstOrDefault(m =>
                    m.StudentID == att.StudentID &&
                    m.TimetableID == att.TimetableID
                );

                if (existing != null)
                {
                    existing.Status = att.Status;
                }
                else
                {
                    _context.Attendance.Add(att);
                }
            }
            return _context.SaveChanges();
        }

        public async Task<object> GetAttendanceByDateAsync(DateTime date, int classId)
        {
            var students = await _context.Students
                .Where(s => s.ClassID == classId)
                .ToListAsync();

            // 2. Get timetable for the day
            var timetables = await _context.Timetables
                .Include(t => t.Period)
                .Include(t => t.Syllabus) 
                .Where(t => t.ClassID == classId && t.DayOfWeek == (int)date.DayOfWeek)
                .OrderBy(t => t.Period.StartTime)
                .ToListAsync();

            // 3. Get attendance records
            var attendances = await _context.Attendance
                .Where(a => a.Date.Date == date.Date && a.Timetable.ClassID == classId)
                .ToListAsync();

            // 4. Build columns
            var columns = new List<object>
            {
                new { field = "studentId", headerName = "Student ID", type = "text", flex = 2, headerClassName= "boldHeaderCell" },
                new { field = "studentName", headerName = "Student Name", type = "text", flex = 2, headerClassName= "boldHeaderCell" }
            };

            if (timetables.Any())
            {
                foreach (var tt in timetables)
                {
                    columns.Add(new
                    {
                        field = $"{tt.TimetableID} {tt.PeriodID}",
                        headerName = $"{tt.Syllabus.Name}",
                        type = "boolean",
                        flex = 1,
                        headerClassName= "boldHeaderCell"
                    });
                }
            }

            // 5. Build rows
            var rows = new List<object>();

            foreach (var student in students)
            {
                var row = new Dictionary<string, object>
                {
                    ["studentId"] = student.StudentID,
                    ["studentName"] = student.Name,
                    ["class"] = student.Class
                };

                if (timetables.Any())
                {
                    foreach (var tt in timetables)
                    {
                        var isPresent = attendances.Any(a =>
                            a.StudentID == student.StudentID &&
                            a.TimetableID == tt.TimetableID && 
                            a.Status == "Present");

                        row[$"{tt.TimetableID} {tt.PeriodID}"] = isPresent;
                    }
                }
                else
                {
                    var isPresent = attendances.Any(a =>
                        a.StudentID == student.StudentID);

                    row["attendance"] = isPresent;
                }

                rows.Add(row);
            }

            return new { columns, rows };
        }

        public async Task<IEnumerable<Attendance>> GetStudentAttendanceAsync(Guid studentId)
        {
            return await _context.Attendance
                .Include(a => a.Timetable)
                .ThenInclude(t => t.Syllabus)
                .Where(a => a.StudentID == studentId)
                .ToListAsync();
        }

        public async Task<bool> UpdateAttendanceAsync(Attendance attendance)
        {
            var existing = await _context.Attendance.FindAsync(attendance.AttendanceID);
            if (existing == null) return false;

            existing.Status = attendance.Status;
            existing.Timestamp = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
