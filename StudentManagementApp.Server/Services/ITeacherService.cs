using SchoolApp.Models;
using System.Collections.Generic;

namespace SchoolApp.Services
{
    public interface ITeacherService
    {
        IEnumerable<Teacher> GetAllTeachers();
        Teacher GetTeacherById(Guid id);
        Teacher GetTeacherByUserId(string id);
        Guid AddTeacher(Teacher teacher);
        void UpdateTeacher(Teacher teacher);
        void DeleteTeacher(Guid id);
    }
}