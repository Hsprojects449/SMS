using System.ComponentModel.DataAnnotations;

namespace SchoolApp.Models
{
    public class FeesPlan
    {
        [Key]
        public Guid FeePlanID { get; set; }
        public string Class { get; set; }
        public decimal Amount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
