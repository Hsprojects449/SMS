using System.Collections.Generic;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public interface ITeacherApplicantService
    {
        IEnumerable<TeacherApplicant> GetAllTeacherApplicants();
        TeacherApplicant GetTeacherApplicantById(Guid id);
        void AddTeacherApplicant(TeacherApplicant TeacherApplicant);
        void DeleteTeacherApplicant(Guid id);
    }
}
