using SchoolApp.Models;

namespace SchoolApp.Services
{
    public interface IFeesPlanService
    {
        IEnumerable<FeesPlan> GetAllFeesPlans();
        FeesPlan GetFeesPlanById(Guid id);
        void AddFeesPlan(FeesPlan feesPlan);
        void UpdateFeesPlan(FeesPlan feesPlan);
        void DeleteFeesPlan(Guid id);
    }
}
