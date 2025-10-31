using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class Class
    {
        [Key]
        public int ClassID { get; set; }
        [ForeignKey("Teacher")]
        public Guid? TeacherID { get; set; }
        [ForeignKey("School")]
        public Guid SchoolID { get; set; }
        public string Name { get; set; }
        public int? TotalStudents { get; set; }
        public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;
    }
}