using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class School
    {
        // [Key]
        // public int SchoolID { get; set; }
        public Guid SchoolID { get; set; }
        public string SchoolCode { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string ContactEmail { get; set; }
        public string ContactPhone { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        // public ICollection<User> Users { get; set; }
    }
}