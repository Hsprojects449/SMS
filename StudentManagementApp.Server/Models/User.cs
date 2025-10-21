using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace SchoolApp.Models
{
    public class User
    {
        //public Guid UserID { get; set;} [date 25th]
        [Key]
        public string UserID { get; set; }
        public Guid? SchoolID { get; set; } // Nullable for System Admin
        public string Role { get; set; }    // Enum: SystemAdmin, SchoolAdmin, Teacher, Student
        public string ContactEmail { get; set; }
        public string PasswordHash { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }

        [ValidateNever]
        [JsonIgnore]
        public School School { get; set; }

        [ValidateNever]
        [JsonIgnore]
        public Student Student { get; set; }
        [ValidateNever]
        [JsonIgnore]
        public Teacher Teacher { get; set; }
        //added for forgot password functionality
        public string? ResetPasswordToken { get; set; }
        public DateTime? ResetPasswordTokenExpiry { get; set; }
    }
}

// [Key]
//         public int UserID { get; set; }

//         [ForeignKey("School")]
//         public int SchoolID { get; set; }

//         public string Role { get; set; }
//         public string Email { get; set; }
//         public byte[] PasswordHash { get; set; }
//         public bool IsActive { get; set; }
//         public DateTime CreatedAt { get; set; }
//         public string? Field { get; set; }