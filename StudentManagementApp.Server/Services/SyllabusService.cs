using System.Collections.Generic;
using System.Linq;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public class SyllabusService : ISyllabusService
    {
        private readonly SchoolContext _context;

        public SyllabusService(SchoolContext context)
        {
            _context = context;
        }

        public IEnumerable<Syllabus> GetAllSyllabus()
        {
            return _context.Syllabuses.ToList();
        }

        public Syllabus GetSyllabusById(int id)
        {
            return _context.Syllabuses.FirstOrDefault(s => s.SyllabusID == id);
        }
        
        public List<Syllabus> GetSyllabusByClassId(int id) => _context.Syllabuses.Where(s => s.ClassID == id).ToList();
        
        public void AddSyllabus(Syllabus newSyllabus)
        {
            _context.Syllabuses.Add(newSyllabus);
            _context.SaveChanges();
        }

        public void UpdateSyllabus(Syllabus updatedSyllabus)
        {
            var existingSyllabus = _context.Syllabuses.Find(updatedSyllabus.SyllabusID);
            if (existingSyllabus != null)
            {
                existingSyllabus.Name = updatedSyllabus.Name;
                existingSyllabus.ClassID = updatedSyllabus.ClassID;
                existingSyllabus.SubjectSyllabus = updatedSyllabus.SubjectSyllabus;
                existingSyllabus.CreatedAt = updatedSyllabus.CreatedAt;
                _context.SaveChanges();
            }
        }

        public void UpdateSyllabusFile(int id, string uploadPath)
        {
            var existingSyllabus = _context.Syllabuses.FirstOrDefault(s => s.SyllabusID == id);
            if (existingSyllabus != null)
            {
                existingSyllabus.SubjectSyllabus = uploadPath;
                _context.SaveChanges();
            }
        }

        public void DeleteSyllabus(int id)
        {
            var syllabusToRemove = _context.Syllabuses.Find(id);
            if (syllabusToRemove != null)
            {
                _context.Syllabuses.Remove(syllabusToRemove);
                _context.SaveChanges();
            }
        }
    }
}
