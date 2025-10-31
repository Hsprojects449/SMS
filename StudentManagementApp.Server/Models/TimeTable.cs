using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class Timetable
    {
        [Key]
        public int TimetableID { get; set; }
        public int ClassID { get; set; }
        public int DayOfWeek { get; set; }
        public int PeriodID { get; set; }
        public int SyllabusID { get; set; }
        public Guid? TeacherID { get; set; }

        public Class Class { get; set; }
        public Period Period { get; set; }
        public Syllabus Syllabus { get; set; }
        public Teacher? Teacher { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Attendance> Attendances { get; set; }
        [ForeignKey("School")]
        public Guid SchoolID { get; set; }
        public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;
    }
}