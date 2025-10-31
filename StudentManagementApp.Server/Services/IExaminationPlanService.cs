using SchoolApp.Models;

namespace SchoolApp.Services
{
    public interface IExaminationPlanService
    {
        IEnumerable<ExaminationPlan> GetAllExaminationPlans();
        ExaminationPlan GetExaminationPlanById(Guid id);
        void AddExaminationPlan(ExaminationPlan examinationPlan);
        void UpdateExaminationPlan(ExaminationPlan examinationPlan);
        void DeleteExaminationPlan(Guid id);
    }
}
