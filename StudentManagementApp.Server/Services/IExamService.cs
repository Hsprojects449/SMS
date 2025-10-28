using SchoolApp.Models;

namespace SchoolApp.Services
{
    public interface IExamService
    {
        IEnumerable<Exam> GetAllExams();
        Exam GetExamById(Guid id);
        void AddExam(Exam exam);
        void UpdateExam(Exam exam);
        void DeleteExam(Guid id);
    }
}