using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class Mark
{
    [Key]
    public int MarkID { get; set; }
    public string ExamName { get; set; }
    [ForeignKey("Student")]
    public Guid StudentID { get; set; }
    public string Name { get; set; }
    [ForeignKey("Class")]
    public string Class { get; set; }
    [ForeignKey("Syllabus")]
    public string Syllabus { get; set; }
    public float? MarksObtained { get; set; }
    public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;
    }
}