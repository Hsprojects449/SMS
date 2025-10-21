using System.Collections.Generic;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public interface IClassAssignmentService
    {
        IEnumerable<ClassAssignment> GetAllClassAssignments();
        ClassAssignment GetClassAssignmentById(int id);
        void AddClassAssignment(ClassAssignment classAssignment);
        void UpdateClassAssignment(ClassAssignment classAssignment);
        void DeleteClassAssignment(int id);
    }
}
