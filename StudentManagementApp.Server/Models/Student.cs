using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class Student
    {
        public Guid StudentID { get; set; }
        //public Guid UserID { get; set; } [25th date]
        public string UserID { get; set; } // FK to User.UserID
        public string Name { get; set; }
        public string Class { get; set; }
        public int ClassID { get; set; }
        public DateTime DOB { get; set; }
        public string Gender { get; set; }
        public string ContactEmail { get; set; }
        public string ParentName { get; set; }
        public string ParentPhone { get; set; }
        public string? Address { get; set; }
        public string? MedicalRecordPath { get; set; }
        public int? AssignedBusID { get; set; }
        public string? ProfilePicture { get; set; }
        // public User? User { get; set; }

        public string? PhoneNumber { get; set; }
        public string? BloodGroup { get; set; }
        public string? Caste { get; set; }
        public string? Religion { get; set; }
        public string? Nationality { get; set; }
        public string? AadhaarNo { get; set; }
    }
}