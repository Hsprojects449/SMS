using System.Collections.Generic;
using System.Linq;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public class StudentService : IStudentService
    {
        private readonly SchoolContext _context;

        public StudentService(SchoolContext context)
        {
            _context = context;
        }

        public IEnumerable<Student> GetAllStudents() => _context.Students.ToList();

        public Student GetStudentById(Guid id) => _context.Students.FirstOrDefault(s => s.StudentID == id);

        public Student GetStudentByUserId(string id) => _context.Students.FirstOrDefault(s => s.UserID == id);

        public List<Student> GetStudentByClassID(int clsID) => _context.Students.Where(s => s.ClassID == clsID).ToList();

        public Guid AddStudent(Student student)
        {
            _context.Students.Add(student);
            _context.SaveChanges();
            return student.StudentID;
        }

        public void UpdateStudent(Student student)
        {
            _context.Students.Update(student);
            _context.SaveChanges();
        }

        public void UpdateStudentMedicalRecord(Guid SID, string newMedicalRecord)
        {
            var existingStudent = _context.Students.FirstOrDefault(s => s.StudentID == SID);
            if (existingStudent != null)
            {
                existingStudent.MedicalRecordPath = newMedicalRecord;
                _context.SaveChanges();
            }
        }

        public void DeleteStudent(Guid id)
        {
            var student = _context.Students.FirstOrDefault(s => s.StudentID == id);
            if (student != null)
            {
                _context.Students.Remove(student);
                _context.SaveChanges();
            }
        }
    }
}
