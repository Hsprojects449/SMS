using System.Collections.Generic;
using System.Linq;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public class ClassService : IClassService
    {
        private readonly SchoolContext _context;
        private readonly ITeacherService _teacherService;

        public ClassService(SchoolContext context, ITeacherService teacherService)
        {
            _context = context;
            _teacherService = teacherService;
        }

        public IEnumerable<Class> GetAllClasses()
        {
            return _context.Classes.ToList();
        }

        public Class GetClassById(int id)
        {
            return _context.Classes.FirstOrDefault(s => s.ClassID == id);
        }

        public Class GetClassByName(string name)
        {
            return _context.Classes.FirstOrDefault(s => s.Name == name);
        }

        public int AddClass(Class newClass)
        {
            _context.Classes.Add(newClass);
            _context.SaveChanges();
            return newClass.ClassID;
        }

        public void UpdateClass(Class updatedClass)
        {
            var existingClass = _context.Classes.Find(updatedClass.ClassID);
            if (existingClass != null)
            {
                var oldTeacherId = existingClass.TeacherID;
                existingClass.Name = updatedClass.Name;
                existingClass.TeacherID = updatedClass.TeacherID;
                // existingClass.SchoolID = updatedClass.SchoolID;
                existingClass.TotalStudents = updatedClass.TotalStudents;
                existingClass.CreatedAt = updatedClass.CreatedAt;

                if (oldTeacherId != null && oldTeacherId != updatedClass.TeacherID)
                    {
                        var oldTeacher = _context.Teachers.Find(oldTeacherId);
                        if (oldTeacher != null)
                        {
                            oldTeacher.AssignedClass = null;
                            oldTeacher.AssignedClassName = null;
                        }
                    }

                // Update teacher if exists
                var teacher = _context.Teachers.Find(updatedClass.TeacherID);
                if (teacher != null)
                {
                    teacher.AssignedClass = updatedClass.ClassID;
                    teacher.AssignedClassName = updatedClass.Name;
                }

                // Save all changes in a single call
                _context.SaveChanges();
            }
        }

        public void DeleteClass(int id)
        {
            var classToRemove = _context.Classes.Find(id);
            if (classToRemove != null)
            {
                _context.Classes.Remove(classToRemove);
                _context.SaveChanges();
            }
        }
    }
}
