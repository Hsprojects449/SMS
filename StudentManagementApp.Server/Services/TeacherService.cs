using SchoolApp.Models;
using System.Collections.Generic;
using System.Linq;

namespace SchoolApp.Services
{
    public class TeacherService : ITeacherService
    {
        private readonly SchoolContext _context;

        public TeacherService(SchoolContext context)
        {
            _context = context;
        }

        public IEnumerable<Teacher> GetAllTeachers() => _context.Teachers.ToList();

        public Teacher GetTeacherById(Guid id) => _context.Teachers.FirstOrDefault(t => t.TeacherID == id);

        public Teacher GetTeacherByUserId(string id) => _context.Teachers.FirstOrDefault(t => t.UserID == id);

        public Guid AddTeacher(Teacher teacher)
        {
            _context.Teachers.Add(teacher);
            _context.SaveChanges();
            return teacher.TeacherID;
        }

        public void UpdateTeacher(Teacher teacher)
        {
            _context.Teachers.Update(teacher);
            _context.SaveChanges();
        }

        public void DeleteTeacher(Guid id)
        {
            var teacher = _context.Teachers.FirstOrDefault(t => t.TeacherID == id);
            if (teacher != null)
            {
                _context.Teachers.Remove(teacher);
                _context.SaveChanges();
            }
        }
    }
}