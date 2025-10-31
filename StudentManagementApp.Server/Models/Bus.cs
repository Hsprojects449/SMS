using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class Bus
    {
        [Key]
        public int BusID { get; set; }
        public string Route { get; set; }
        public string BusNo { get; set; }
        public string Driver { get; set; }
        public string Contact { get; set; }
        [Column(TypeName = "longtext")]
        public string? Stops { get; set; }
        [Column(TypeName = "longtext")]
        public string? AssignedUsers { get; set; }
        public string? RemovedUsers { get; set; }
        [ForeignKey("School")]
        public Guid SchoolID { get; set; }
        public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;
    }
}