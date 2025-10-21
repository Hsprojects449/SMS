using System.Collections.Generic;
using System.Linq;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public class TestAssignmentService : ITestAssignmentService
    {
        private readonly SchoolContext _context;

        public TestAssignmentService(SchoolContext context)
        {
            _context = context;
        }

        public IEnumerable<TestAssignment> GetAllTestAssignments() => _context.TestAssignments.ToList();

        public TestAssignment GetTestAssignmentById(int id) => _context.TestAssignments.FirstOrDefault(ta => ta.AssignmentID == id);

        public void AddTestAssignment(TestAssignment testAssignment)
        {
            _context.TestAssignments.Add(testAssignment);
            _context.SaveChanges();
        }

        public void UpdateTestAssignment(TestAssignment testAssignment)
        {
            _context.TestAssignments.Update(testAssignment);
            _context.SaveChanges();
        }

        public void DeleteTestAssignment(int id)
        {
            var testAssignment = _context.TestAssignments.FirstOrDefault(ta => ta.AssignmentID == id);
            if (testAssignment != null)
            {
                _context.TestAssignments.Remove(testAssignment);
                _context.SaveChanges();
            }
        }
    }
}
