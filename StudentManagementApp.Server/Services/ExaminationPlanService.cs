using SchoolApp.Models;

namespace SchoolApp.Services
{
    public class ExaminationPlanService : IExaminationPlanService
    {
        private readonly SchoolContext _context;

        public ExaminationPlanService(SchoolContext context)
        {
            _context = context;
        }
        public IEnumerable<ExaminationPlan> GetAllExaminationPlans()
        {
            return _context.ExaminationPlans.ToList();
        }
        public ExaminationPlan GetExaminationPlanById(Guid id)
        {
            return _context.ExaminationPlans.FirstOrDefault(e => e.ExamPlanID == id);
        }
        public void AddExaminationPlan(ExaminationPlan examinationPlan)
        {
            _context.ExaminationPlans.Add(examinationPlan);
            _context.SaveChanges();
        }
        public void UpdateExaminationPlan(ExaminationPlan examinationPlan)
        {
            _context.ExaminationPlans.Update(examinationPlan);
            _context.SaveChanges();
        }
        public void DeleteExaminationPlan(Guid id)
        {
            var examinationPlan = _context.ExaminationPlans.FirstOrDefault(e => e.ExamPlanID == id);
            if (examinationPlan != null)
            {
                _context.ExaminationPlans.Remove(examinationPlan);
                _context.SaveChanges();
            }
        }
    }
}