using System.ComponentModel.DataAnnotations;

namespace SchoolApp.Models
{
    public class ExaminationPlan
    {
        [Key]
        public Guid ExamPlanID { get; set; }
        public string Name { get; set; }
        public decimal Fees { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
