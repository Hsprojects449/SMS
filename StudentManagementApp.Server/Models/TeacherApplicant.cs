using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class TeacherApplicant
    {
        public Guid TeacherApplicantID { get; set; }
        public string Name { get; set; }
        public string Gender { get; set; }
        public string PasswordHash { get; set; }
        public string Qualification { get; set; }
        public string SubjectSpecialization { get; set; }
        public string? Experience { get; set; }
        public string ContactEmail { get; set; }
        public string ContactPhone { get; set; }
        public string? Address { get; set; }
        public DateTime DOB { get; set; }
        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
        public string? ProfilePicture { get; set; }

        // New fields
        public string? BloodGroup { get; set; }
        public string? Religion { get; set; }
        public string? Nationality { get; set; }
        public string? AadhaarNo { get; set; }
        [ForeignKey("School")]
        public Guid SchoolID { get; set; }
        public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
