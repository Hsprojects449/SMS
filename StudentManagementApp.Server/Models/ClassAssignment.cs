using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class ClassAssignment
    {
        [Key]
        public int AssignmentID { get; set; }
        [ForeignKey("Teacher")]
        public int TeacherID { get; set; }
        [ForeignKey("School")]
        public int SchoolID { get; set; }
        [ForeignKey("Class")]
        public int ClassID { get; set; }
        public string Subject { get; set; }
        public DateTime UploadedAt { get; set; }
    }
}
