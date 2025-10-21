using System.Collections.Generic;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public interface ITestAssignmentService
    {
        IEnumerable<TestAssignment> GetAllTestAssignments();
        TestAssignment GetTestAssignmentById(int id);
        void AddTestAssignment(TestAssignment testAssignment);
        void UpdateTestAssignment(TestAssignment testAssignment);
        void DeleteTestAssignment(int id);
    }
}
