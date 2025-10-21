using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class Attendance
    {
        [Key]
        public int AttendanceID { get; set; }
        [ForeignKey("Student")]
        public Guid StudentID { get; set; }
        public string Name { get; set; }
        [ForeignKey("Class")]
        public string Class { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
        [ForeignKey("TimeTable")]
        public int TimetableID { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public Student? Student { get; set; }
        public Timetable? Timetable { get; set; }
        [ForeignKey("User")]
        public string MarkedUser { get; set; }
    }
}