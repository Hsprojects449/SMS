using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class Teacher
    {
        public Guid TeacherID { get; set; }
        //public Guid UserID { get; set; } [25th date]
        public string UserID { get; set; }    // FK to User.UserID
        public string Name { get; set; }
        public DateTime JoinedAt { get; set; }
        public string Gender { get; set; }
        public string Qualification { get; set; }
        public string SubjectSpecialization { get; set; }
        public string? Experience { get; set; }
        public DateTime DOB { get; set; }
        [ForeignKey("Class")]
        public int? AssignedClass { get; set; }
        public string? AssignedClassName { get; set; }
        public string ContactEmail { get; set; }
        public string ContactPhone { get; set; }
        public string? Address { get; set; }
        public int? AssignedBusID { get; set; }
        public string? ProfilePicture { get; set; }
        // public User User { get; set; }
        public string? BloodGroup { get; set; }
        public string? Religion { get; set; }
        public string? Nationality { get; set; }
        public string? AadhaarNo { get; set; }
    }
}
