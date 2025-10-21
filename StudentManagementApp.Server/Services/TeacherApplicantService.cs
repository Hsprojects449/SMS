using System.Collections.Generic;
using System.Linq;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public class TeacherApplicantService : ITeacherApplicantService
    {
        private readonly SchoolContext _context;

        public TeacherApplicantService(SchoolContext context)
        {
            _context = context;
        }

        public IEnumerable<TeacherApplicant> GetAllTeacherApplicants() => _context.TeacherApplicants.ToList();

        public TeacherApplicant GetTeacherApplicantById(Guid id) => _context.TeacherApplicants.FirstOrDefault(s => s.TeacherApplicantID == id);

        public void AddTeacherApplicant(TeacherApplicant teacherApplicant)
        {
            _context.TeacherApplicants.Add(teacherApplicant);
            _context.SaveChanges();
        }

        public void DeleteTeacherApplicant(Guid id)
        {
            var teacherapplicant = _context.TeacherApplicants.FirstOrDefault(s => s.TeacherApplicantID == id);
            if (teacherapplicant != null)
            {
                _context.TeacherApplicants.Remove(teacherapplicant);
                _context.SaveChanges();
            }
        }
    }
}
