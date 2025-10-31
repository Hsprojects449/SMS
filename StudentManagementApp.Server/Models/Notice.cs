using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class Notice
    {
        [Key]
        public int NoticeID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string? NoticeContent { get; set; }
        public DateTime? Occurance { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [ForeignKey("School")]
        public Guid SchoolID { get; set; }
        public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;
    }
}