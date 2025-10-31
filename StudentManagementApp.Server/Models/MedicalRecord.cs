using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class MedicalRecord
    {
        [Key]
        public int RecordID { get; set; }
        public Guid StudentID { get; set; }
        public string DocumentPath { get; set; }
        public DateTime UploadedAt { get; set; }
        [ForeignKey("User")]
        public int MarkedBy { get; set; }
        public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;
    }
}