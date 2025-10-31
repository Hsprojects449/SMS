using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class MockTest
    {
        [Key]
        public int TestID { get; set; }
        [ForeignKey("School")]
        public int SchoolID { get; set; }
        public string Class { get; set; }
        public string Subject { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int? Duration { get; set; }
        [Column(TypeName = "longtext")]
        public string? Questions { get; set; }
        public bool Status { get; set; }
        [ForeignKey("User")]
        public string CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
