using System.Collections.Generic;
using System.Linq;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public class ClassAssignmentService : IClassAssignmentService
    {
        private readonly SchoolContext _context;

        public ClassAssignmentService(SchoolContext context)
        {
            _context = context;
        }

        public IEnumerable<ClassAssignment> GetAllClassAssignments() => _context.ClassAssignments.ToList();

        public ClassAssignment GetClassAssignmentById(int id) => _context.ClassAssignments.FirstOrDefault(ca => ca.AssignmentID == id);

        public void AddClassAssignment(ClassAssignment classAssignment)
        {
            _context.ClassAssignments.Add(classAssignment);
            _context.SaveChanges();
        }

        public void UpdateClassAssignment(ClassAssignment classAssignment)
        {
            _context.ClassAssignments.Update(classAssignment);
            _context.SaveChanges();
        }

        public void DeleteClassAssignment(int id)
        {
            var classAssignment = _context.ClassAssignments.FirstOrDefault(ca => ca.AssignmentID == id);
            if (classAssignment != null)
            {
                _context.ClassAssignments.Remove(classAssignment);
                _context.SaveChanges();
            }
        }
    }
}
