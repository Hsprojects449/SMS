using System.Collections.Generic;
using System.Linq;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public class StudentApplicantService : IStudentApplicantService
    {
        private readonly SchoolContext _context;

        public StudentApplicantService(SchoolContext context)
        {
            _context = context;
        }

        public IEnumerable<StudentApplicant> GetAllStudentApplicants() => _context.StudentApplicants.ToList();

        public StudentApplicant GetStudentApplicantById(Guid id) => _context.StudentApplicants.FirstOrDefault(s => s.StudentApplicantID == id);

        public void AddStudentApplicant(StudentApplicant studentApplicant)
        {
            _context.StudentApplicants.Add(studentApplicant);
            _context.SaveChanges();
        }

        public void DeleteStudentApplicant(Guid id)
        {
            var studentapplicant = _context.StudentApplicants.FirstOrDefault(s => s.StudentApplicantID == id);
            if (studentapplicant != null)
            {
                _context.StudentApplicants.Remove(studentapplicant);
                _context.SaveChanges();
            }
        }
    }
}
