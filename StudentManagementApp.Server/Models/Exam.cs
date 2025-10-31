using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class Exam
    {
        [Key]
        public Guid ExamID { get; set; }            // Primary Key
        [ForeignKey("ExaminationPlan")]
        public Guid ExamPlanID { get; set; }        // FK to ExaminationPlan
        [ForeignKey("Student")]
        public Guid StudentID { get; set; }         // FK to Student
        public string StudentName { get; set; }
        public string FeeStatus { get; set; }
        public decimal Marks { get; set; }
        public string Status { get; set; }          // e.g., Passed, Failed
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
