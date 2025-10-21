using System.Collections.Generic;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public interface ISchoolService
    {
        IEnumerable<School> GetAllSchools();
        School GetSchoolById(Guid id);
        void AddSchool(School school);
        void UpdateSchool(School school);
        void DeleteSchool(Guid id);
    }
}
