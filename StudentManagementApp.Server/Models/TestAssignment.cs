using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class TestAssignment
    {
        [Key]
        public int AssignmentID { get; set; }
        [ForeignKey("MockTest")]
        public int TestID { get; set; }
        [ForeignKey("Student")]
        public int StudentID { get; set; }
        public bool IsCompleted { get; set; }
        public double Score { get; set; }
        public DateTime AttemptedAt { get; set; }
        public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
