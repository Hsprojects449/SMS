using System.Collections.Generic;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public interface ISyllabusService
    {
        IEnumerable<Syllabus> GetAllSyllabus();
        Syllabus GetSyllabusById(int id);
        List<Syllabus> GetSyllabusByClassId(int id);
        void AddSyllabus(Syllabus newSyllabus);
        void UpdateSyllabus(Syllabus updatedSyllabus);
        void UpdateSyllabusFile(int id, string uploadPath);
        void DeleteSyllabus(int id);
    }
}
