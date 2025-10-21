using System.Collections.Generic;
using System.Threading.Tasks;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public interface IMarkService
    {
        IEnumerable<Mark> GetAllMarks();
        Mark GetMarksById(int id);
        object GetMarksByClassandSubject(string cls, string sub);
        List<Mark> GetMarksforStudent(Guid SID);
        Task<int> AddMark(string cls, string sub, List<Mark> mark);
        void UpdateMark(Mark mark);
        void DeleteMark(int id);
    }
}
