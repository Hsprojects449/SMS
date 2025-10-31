using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class LoginRequest
    {
        public string Identifier { get; set; }
        public string Password { get; set; }
        [ForeignKey("School")]
        public Guid SchoolID { get; set; }
        public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
