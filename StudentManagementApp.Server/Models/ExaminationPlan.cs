using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class ExaminationPlan
    {
        [Key]
        public Guid ExamPlanID { get; set; }
        public string Name { get; set; }
        public decimal Fees { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        [ForeignKey("School")]
        public Guid SchoolID { get; set; }
        public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
