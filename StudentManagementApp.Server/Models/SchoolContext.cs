using Microsoft.EntityFrameworkCore;

namespace SchoolApp.Models
{
    public class SchoolContext : DbContext
    {
        public SchoolContext(DbContextOptions options) : base(options) { }
        // public SchoolContext(DbContextOptions<SchoolContext> options) : base(options) { }
        public DbSet<MockTest> MockTests { get; set; }
        public DbSet<TestAssignment> TestAssignments { get; set; }
        public DbSet<Attendance> Attendance { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }
        public DbSet<ClassAssignment> ClassAssignments { get; set; }
        public DbSet<Bus> Buses { get; set; }
        public DbSet<StudentApplicant> StudentApplicants { get; set; }
        public DbSet<TeacherApplicant> TeacherApplicants { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<School> Schools { get; set; }
        public DbSet<Notice> Notices { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<Syllabus> Syllabuses { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UploadedFile> UploadedFiles { get; set; }
        public DbSet<Mark> Marks { get; set; }
        public DbSet<Timetable> Timetables { get; set; }
        public DbSet<Period> Periods { get; set; }
        public DbSet<Hostel> Hostels { get; set; }
        public DbSet<FeesPlan> FeesPlans { get; set; }
        public DbSet<Fee> Fees {  get; set; }
        public DbSet<ExaminationPlan> ExaminationPlans { get; set; }
        public DbSet<Exam> Exams { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // base.OnModelCreating(modelBuilder);
            // modelBuilder.Entity<User>()
            //     .HasOne(u => u.Student)
            //     .WithOne(s => s.User)
            //     .HasForeignKey<Student>(s => s.UserID);

            // modelBuilder.Entity<User>()
            //     .HasOne(u => u.Teacher)
            //     .WithOne(t => t.User)
            //     .HasForeignKey<Teacher>(t => t.UserID);

            // modelBuilder.Entity<MockTest>()
            //     .HasOne(m => m.CreatedByUser)            // navigation property in MockTest
            //     .WithMany()                     // User does NOT have a collection for MockTests, so empty
            //     .HasForeignKey(m => m.CreatedBy)
            //     .OnDelete(DeleteBehavior.Restrict);

            // modelBuilder.Entity<Attendance>()
            //     .HasOne(a => a.MarkedByUser)  // Adjust property name if different
            //     .WithMany()                   // Assuming User does not have ICollection<Attendance> navigation
            //     .HasForeignKey(a => a.MarkedBy)
            //     .OnDelete(DeleteBehavior.Restrict);

            // modelBuilder.Entity<MedicalRecord>()
            //     .HasOne(mr => mr.MarkedByUser) // navigation property to User; adjust if named differently
            //     .WithMany()                   // if User does not have ICollection<MedicalRecord>
            //     .HasForeignKey(mr => mr.MarkedBy)
            //     .OnDelete(DeleteBehavior.Restrict);

            // modelBuilder.Entity<TestAssignment>()
            //     .HasOne(ta => ta.Student)   // navigation property in TestAssignment pointing to Student
            //     .WithMany()                 // or .WithMany(s => s.TestAssignments) if you have that navigation
            //     .HasForeignKey(ta => ta.StudentID)
            //     .OnDelete(DeleteBehavior.Restrict);

            // modelBuilder.Entity<Class>()
            //     .HasOne(c => c.Teacher)   // navigation property to Teacher in Class entity
            //     .WithMany()               // or .WithMany(t => t.Classes) if you have that navigation
            //     .HasForeignKey(c => c.TeacherID)
            //     .OnDelete(DeleteBehavior.Restrict);

            // modelBuilder.Entity<ClassAssignment>()
            //     .HasOne(ca => ca.School)  // navigation property to School
            //     .WithMany()               // or .WithMany(s => s.ClassAssignments) if exists
            //     .HasForeignKey(ca => ca.SchoolID)
            //     .OnDelete(DeleteBehavior.Restrict);

            // modelBuilder.Entity<ClassAssignment>()
            //     .HasOne(ca => ca.Teacher)
            //     .WithMany() // or .WithMany(t => t.ClassAssignments) if you have navigation
            //     .HasForeignKey(ca => ca.TeacherID)
            //     .OnDelete(DeleteBehavior.Restrict);

        }
        
    }
}
// .OnDelete(DeleteBehavior.Restrict);  this disables cascade delete to fix multiple cascade paths