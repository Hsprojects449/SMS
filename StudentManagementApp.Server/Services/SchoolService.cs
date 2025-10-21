using System.Collections.Generic;
using System.Linq;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public class SchoolService : ISchoolService
    {
        private readonly SchoolContext _context;

        public SchoolService(SchoolContext context)
        {
            _context = context;
        }

        public IEnumerable<School> GetAllSchools()
        {
            return _context.Schools.ToList();
        }

        public School GetSchoolById(Guid id)
        {
            return _context.Schools.FirstOrDefault(s => s.SchoolID == id);
        }

        public void AddSchool(School school)
        {
            _context.Schools.Add(school);
            _context.SaveChanges();
        }

        public void UpdateSchool(School school)
        {
            _context.Schools.Update(school);
            _context.SaveChanges();
        }

        public void DeleteSchool(Guid id)
        {
            var school = _context.Schools.FirstOrDefault(s => s.SchoolID == id);
            if (school != null)
            {
                _context.Schools.Remove(school);
                _context.SaveChanges();
            }
        }
    }
}
