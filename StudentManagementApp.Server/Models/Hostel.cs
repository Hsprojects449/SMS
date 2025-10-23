using System.ComponentModel.DataAnnotations;

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
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
