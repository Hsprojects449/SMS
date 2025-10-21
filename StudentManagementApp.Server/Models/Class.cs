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
        // [ForeignKey("School")]
        // public int SchoolID { get; set; }
        public string Name { get; set; }
        public int? TotalStudents { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}