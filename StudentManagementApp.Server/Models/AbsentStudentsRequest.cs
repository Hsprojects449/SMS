using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class AbsentStudentsRequest
    {
        public List<Guid> AbsentStudentIds { get; set; }
        [ForeignKey("School")]
        public Guid SchoolID { get; set; }
        public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
