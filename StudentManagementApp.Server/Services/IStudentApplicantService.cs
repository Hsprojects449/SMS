using System.Collections.Generic;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public interface IStudentApplicantService
    {
        IEnumerable<StudentApplicant> GetAllStudentApplicants();
        StudentApplicant GetStudentApplicantById(Guid id);
        void AddStudentApplicant(StudentApplicant studentApplicant);
        void DeleteStudentApplicant(Guid id);
    }
}
