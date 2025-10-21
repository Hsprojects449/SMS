using System.Collections.Generic;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public interface ITimetableService
    {
        Task<int> AddTimetableAsync(List<TimetableDto> timetable);
        Task<IEnumerable<Timetable>> GetTimetablesAsync();
        Task<object> GetTimetableByIdAsync(int id);
        Task<IEnumerable<Timetable>> GetClassTimetableAsync(int classId, int dayOfWeek);
        Task<bool> DeleteTimetableAsync(int id);
    }
}