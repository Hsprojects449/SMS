using System.Collections.Generic;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public interface IStudentService
    {
        IEnumerable<Student> GetAllStudents();
        Student GetStudentById(Guid id);
        Student GetStudentByUserId(string id);
        List<Student> GetStudentByClassID(int clsID);
        Guid AddStudent(Student student);
        void UpdateStudent(Student student);
        void UpdateStudentMedicalRecord(Guid SID, string newMedicalRecord);
        void DeleteStudent(Guid id);
    }
}
