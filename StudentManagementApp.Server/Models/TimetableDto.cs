using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class TimetableDto
    {
        public int ClassID { get; set; }
        public int DayOfWeek { get; set; }
        public string PeriodID { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public int SyllabusID { get; set; }
        [ForeignKey("School")]
        public Guid SchoolID { get; set; }
        public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;
    }
}