using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class Syllabus
    {
        [Key]
        public int SyllabusID { get; set; }
        [ForeignKey("Class")]
        public int ClassID { get; set; }
        public string Name { get; set; }
        public string? SubjectSyllabus { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
    }
}