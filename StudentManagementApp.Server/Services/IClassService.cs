using System.Collections.Generic;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public interface IClassService
    {
        IEnumerable<Class> GetAllClasses();
        Class GetClassById(int id);
        Class GetClassByName(string name);
        int AddClass(Class newClass);
        void UpdateClass(Class updatedClass);
        void DeleteClass(int id);
    }
}
