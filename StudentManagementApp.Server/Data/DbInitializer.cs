using Microsoft.AspNetCore.Identity;
using SchoolApp.Models;

namespace SchoolApp.Data
{
    public static class DbInitializer
    {
        public static void Seed(SchoolContext context)
        {
            if (!context.Schools.Any())
            {
                var school = new School
                {
                    SchoolID = Guid.NewGuid(),
                    Name = "Greenfield High",
                    SchoolCode = "GFH001",
                    Address = "123 Main Street",
                    ContactEmail = "admin@greenfield.com",
                    ContactPhone = "9876543210",
                    CreatedAt = DateTime.UtcNow
                };
                context.Schools.Add(school);
                context.SaveChanges();
            }
            var defaultSchool = context.Schools.First();

            const string adminEmail = "adminVSN@gmail.com";
            const string adminPassword = "Admin@123!";

            // Check by email (more precise than checking by role alone)
            if (!context.Users.Any(u => u.ContactEmail == adminEmail))
            {
                var hasher = new PasswordHasher<User>();
                var admin = new User
                {
                    UserID = "300985",
                    SchoolID = defaultSchool.SchoolID,
                    Role = "SysAdmin",
                    ContactEmail = adminEmail,
                    Name = "Greenfield Administrator",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    PasswordHash = adminPassword // will populate next
                };
                //admin.PasswordHash = hasher.HashPassword(admin, "Admin@123!");
                context.Users.Add(admin);
                context.SaveChanges();

            }
        }
    }
}