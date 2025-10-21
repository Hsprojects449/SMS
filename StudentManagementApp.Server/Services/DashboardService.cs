using System;
using System.Collections.Generic;
using System.Linq;
using SchoolApp.Models;
using System.Text.Json;
using Newtonsoft.Json.Linq;

namespace SchoolApp.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly SchoolContext _context;

        public DashboardService(SchoolContext context)
        {
            _context = context;
        }

        public Dictionary<string, object> GetAdminDashboard()
        {
            var today = DateTime.Today;
            var todayStr = today.ToString("yyyy-MM-dd");

            var upcomingEvents = _context.Notices
                .Where(n => n.Occurance > today)
                .OrderBy(n => n.Occurance)
                .Take(3)
                .Select(n => new
                {
                    date = n.Occurance,
                    eventName = n.Title
                })
                .ToList<object>();

            var liveMocks = _context.MockTests
                .Where(m => m.Status)
                .OrderBy(m => m.CreatedAt)
                .Take(3)
                .Select(m => $"Class {m.Title}")
                .ToList<object>();

            // var barData = _context.Classes
            //     .Select(c => new
            //     {
            //         c.Name,
            //         c.Attendance
            //     })
            //     .AsEnumerable()
            //     .Select(c =>
            //     {
            //         int presentCount = 0;
            //         if (!string.IsNullOrEmpty(c.Attendance))
            //         {
            //             try
            //             {
            //                 var attendanceDict = JsonSerializer.Deserialize<Dictionary<string, Dictionary<string, string>>>(c.Attendance);

            //                 if (attendanceDict != null && attendanceDict.TryGetValue(todayStr, out var todayAttendance))
            //                 {
            //                     presentCount = todayAttendance.Values.Count(v => v == "Present");
            //                 }
            //             }
            //             catch
            //             {
            //             }
            //         }

            //         return new
            //         {
            //             name = $"Class {c.Name}",
            //             students = presentCount
            //         };
            //     })
            //     .ToList<object>();

            var classes = _context.Classes.ToList();

            var barData = classes
                .Select(c => new
                {
                    name = $"Class {c.Name}",
                    students = _context.Attendance
                        .Where(a => a.Class == c.Name
                                    && a.Date == today
                                    && a.Status == "Present")
                        .Select(a => a.StudentID)
                        .Distinct()
                        .Count()
                })
                .ToList<object>();

            return new Dictionary<string, object>
            {
                { "totalTeachers", _context.Teachers.Count() },
                { "totalStudents", _context.Students.Count() },
                { "totalClasses", _context.Classes.Count() },
                { "totalSubjects", _context.Syllabuses.Count() },
                { "upcomingEvents", upcomingEvents },
                { "liveMocks", liveMocks },
                { "barData", barData }
            };
        }

        public Dictionary<string, object> GetStudentDashboard(Guid SID)
        {
            var today = DateTime.Today;
            var StudentData = _context.Students.FirstOrDefault(s => s.StudentID == SID);

            var upcomingEvents = _context.Notices
                .Where(n => n.Occurance > today)
                .OrderBy(n => n.Occurance)
                .Take(3)
                .Select(n => new
                {
                    date = n.Occurance,
                    eventName = n.Title
                })
                .ToList<object>();

            var liveMocks = _context.MockTests
                .Where(m => m.Status && m.Class == StudentData.Class)
                .OrderBy(m => m.CreatedAt)
                .Take(3)
                .Select(m => new
                {
                    subject = m.Subject,
                    description = m.Description
                })
                .ToList<object>();

            // var studentID = StudentData.StudentID.ToString();
            // var classID = StudentData.ClassID;
            // var subjects = _context.Syllabuses
            // .Where(s => s.ClassID == classID)
            // .Select(s => s.Name)
            // .ToList();

            // // Fetch and parse marks JSON from Classes table
            // var marksJsonString = _context.Classes
            //     .Where(c => c.Name == StudentData.Class)
            //     .Select(c => c.Marks)
            //     .FirstOrDefault();

            // var recentMarks = new List<object>();

            // if (!string.IsNullOrWhiteSpace(marksJsonString))
            // {
            //     var marksData = JObject.Parse(marksJsonString);

            //     foreach (var subject in subjects)
            //     {
            //         if (marksData[subject] is JObject exams)
            //         {
            //             var marks = exams.Properties()
            //                 .Select(p => p.Value?[studentID]?.ToString())
            //                 .Where(val => int.TryParse(val, out _))
            //                 .Select(val => int.Parse(val))
            //                 .ToList();

            //             if (marks.Any())
            //             {
            //                 var average = marks.Any() ? (int?)Math.Round(marks.Average()) : null;
            //                 recentMarks.Add(new { name = subject, marks = average });
            //             }
            //         }
            //     }
            // }
            var studentID = StudentData.StudentID;
            var classID = StudentData.ClassID;
            var className = StudentData.Class;

            // Get all subjects for the class
            var subjects = _context.Syllabuses
                .Where(s => s.ClassID == classID)
                .Select(s => s.Name)
                .ToList();

            var recentMarks = new List<object>();

            foreach (var subject in subjects)
            {
                // Fetch all marks for this student + subject
                var marks = _context.Marks
                    .Where(m => m.StudentID == studentID && m.Class == className && m.Syllabus == subject)
                    .Select(m => m.MarksObtained)   // assuming column name is Marks (int)
                    .ToList();

                if (marks.Any())
                {
                    var avg = marks.Where(m => m.HasValue).Average(m => (double)m.Value);
                    var average = (int)Math.Round(avg);
                    recentMarks.Add(new { name = subject, marks = average });
                }
            }

            return new Dictionary<string, object>
            {
                { "upcomingEvents", upcomingEvents },
                { "liveMocks", liveMocks },
                { "recentMarks", recentMarks }
            };
        }

        public Dictionary<string, object> GetTeacherDashboard(Guid TID)
        {
            var today = DateTime.Today;
            var TeacherData = _context.Teachers.FirstOrDefault(s => s.TeacherID == TID);

            if (TeacherData == null)
            {
                throw new Exception("Teacher not found");
            }

            var upcomingEvents = _context.Notices
                .Where(n => n.Occurance > today)
                .OrderBy(n => n.Occurance)
                .Take(3)
                .Select(n => new
                {
                    date = n.Occurance,
                    eventName = n.Title
                })
                .ToList<object>();

            var assignedClass = _context.Classes
                .FirstOrDefault(n => n.ClassID == TeacherData.AssignedClass); // fetch full object

            var studentCount = _context.Students
                .Count(n => n.ClassID == TeacherData.AssignedClass);

            return new Dictionary<string, object>
            {
                { "upcomingEvents", upcomingEvents },
                { "assignedClass", assignedClass },
                { "studentsInClass", studentCount }
            };
        }

    }
}
