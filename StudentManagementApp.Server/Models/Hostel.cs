using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class Hostel
    {
        [Key]
        public Guid HostelID { get; set; }
        public string RoomNo { get; set; }
        public string Block { get; set; }
        public int Capacity { get; set; }
        public int Available { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [ForeignKey("School")]
        public Guid SchoolID { get; set; }
        public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
