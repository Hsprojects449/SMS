using SchoolApp.Models;

namespace SchoolApp.Services
{
    public class ExamService : IExamService
    {
        private readonly SchoolContext _context;

        public ExamService(SchoolContext context)
        {
            _context = context;
        }
        public IEnumerable<Exam> GetAllExams()
        {
            return _context.Exams.ToList();
        }
        public Exam GetExamById(Guid id)
        {
            return _context.Exams.FirstOrDefault(e => e.ExamID == id);
        }
        public void AddExam(Exam exam)
        {
            _context.Exams.Add(exam);
            _context.SaveChanges();
        }
        public void UpdateExam(Exam exam)
        {
            _context.Exams.Update(exam);
            _context.SaveChanges();
        }
        public void DeleteExam(Guid id)
        {
            var exam = _context.Exams.FirstOrDefault(e => e.ExamID == id);
            if (exam != null)
            {
                _context.Exams.Remove(exam);
                _context.SaveChanges();
            }
        }
    }
}