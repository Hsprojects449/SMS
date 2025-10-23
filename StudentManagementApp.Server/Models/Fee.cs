using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class Fee
    {
        [Key]
        public Guid FeeID { get; set; }                 // Primary Key
        [ForeignKey("FeesPlan")]
        public Guid FeePlanID { get; set; }             // FK to FeesPlan.FeePlanID
        [ForeignKey("Student")]
        public Guid StudentID { get; set; }             // FK to Student.StudentID
        public string StudentName { get; set; }
        public decimal Paid { get; set; }
        public string Status { get; set; }
        public decimal Concession { get; set; }
        public string Type { get; set; }                // Regular / Donation
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
